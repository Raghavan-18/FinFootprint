"""
FinProof Backend — FastAPI Application

Digital Financial Footprint System for informal workers.

Endpoints:
  POST /api/transactions          — Add financial activity
  GET  /api/transactions          — Retrieve financial history
  GET  /api/profile               — Worker profile
  GET  /api/financial-stats       — Aggregate financial stats
  GET  /api/cashflows             — Monthly cashflows
  GET  /api/analysis              — Run full analysis (behaviour + anomalies)
  GET  /api/analysis/evidence     — Evidence classification breakdown
  GET  /api/analysis/behaviour    — Financial behaviour analysis only
  GET  /api/analysis/anomalies    — Anomaly detection only
  GET  /api/financial-profile     — Complete Digital Financial Profile
  GET  /api/lender-report         — Lender-ready summary

IMPORTANT LIMITATIONS:
  - Synthetic data is used for this MVP
  - No real bank integrations
  - Not a credit score
  - Not a loan approval system
"""

from __future__ import annotations

import uuid
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.evidence_engine import classify_evidence
from app.ml_engine import analyse_financial_behaviour, detect_anomalies
from app.models import (
    ActivityAnalysisRequest,
    AnalysisMetricResponse,
    AnalysisResponse,
    EvidenceStatus,
    ProfileAnalysisRequest,
    TransactionCreate,
    TransactionResponse,
)
from app.profile_generator import run_full_analysis, SYSTEM_LIMITATIONS
from app.synthetic_data import generate_supporting_record, generate_worker_data


# --- In-memory data store (MVP) ---
_store: dict = {}


def _init_store():
    """Initialize with synthetic data."""
    data = generate_worker_data()
    _store["worker"] = data["worker"]
    _store["transactions"] = data["transactions"]
    _store["analysis_cache"] = None  # Cache for the latest analysis


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load synthetic data."""
    _init_store()
    yield


# --- App ---
app = FastAPI(
    title="FinFootprint API",
    description=(
        "Digital Financial Footprint System for informal workers. "
        "Classifies evidence, analyses behaviour, detects anomalies, "
        "and produces structured financial profiles."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================
# Helper
# =============================================================

def _run_analysis() -> dict:
    """Run the full analysis pipeline and cache results."""
    result = run_full_analysis(_store["worker"], _store["transactions"])
    _store["analysis_cache"] = result
    return result


def _get_analysis() -> dict:
    """Get cached analysis or run fresh."""
    if _store.get("analysis_cache") is None:
        return _run_analysis()
    return _store["analysis_cache"]


# =============================================================
# 1. Worker Profile
# =============================================================

@app.get("/api/profile")
def get_profile():
    """Retrieve worker profile information."""
    w = _store["worker"]
    return {
        "id": w["id"],
        "fullName": w["full_name"],
        "occupation": w["occupation"],
        "city": w["city"],
        "phone": w["phone"],
        "memberSince": w["member_since"],
        "kycStatus": w["kyc_status"],
        "dataSource": "SYNTHETIC",
    }


# =============================================================
# 2. Transactions
# =============================================================

@app.get("/api/transactions")
def get_transactions(
    type: str | None = Query(None, description="Filter by type: INCOME, EXPENSE, ALL"),
    evidenceStatus: str | None = Query(None, description="Filter by evidence status"),
    search: str | None = Query(None, description="Search in title, counterparty, category"),
):
    """Retrieve financial history with optional filters."""
    analysis = _get_analysis()
    txs = analysis["classified_transactions"]

    # Apply filters
    if type and type.upper() != "ALL":
        txs = [t for t in txs if t.type.value.upper() == type.upper()]

    if evidenceStatus and evidenceStatus.upper() != "ALL":
        target = evidenceStatus.upper()
        txs = [t for t in txs if t.evidenceStatus.value.upper() == target]

    if search:
        q = search.lower()
        txs = [
            t for t in txs
            if q in t.title.lower()
            or q in t.counterparty.lower()
            or q in t.category.lower()
            or q in (t.reference or "").lower()
        ]

    return [t.model_dump() for t in txs]


@app.post("/api/transactions")
def add_transaction(payload: TransactionCreate):
    """
    Add a new financial activity.

    The system automatically:
    1. Generates a simulated supporting record
    2. Classifies the evidence
    3. Returns the classified transaction
    4. Invalidates the analysis cache
    """
    tx_dict = {
        "id": f"tx_{uuid.uuid4().hex[:8]}",
        "title": payload.title,
        "type": payload.type.value,
        "category": payload.category,
        "amount": payload.amount,
        "date": payload.date,
        "counterparty": payload.counterparty,
        "paymentMethod": payload.paymentMethod.value,
        "reference": payload.reference or payload.referenceId or "",
        "referenceId": payload.reference or payload.referenceId or "",
        "proofFileName": payload.proofFileName or payload.proofDocument or "",
        "proofDocument": payload.proofFileName or payload.proofDocument or "",
        "notes": payload.notes,
    }

    # Generate supporting record and classify
    supporting = generate_supporting_record(tx_dict)
    ev = classify_evidence(tx_dict, supporting)

    status = ev["status"]

    response = TransactionResponse(
        id=tx_dict["id"],
        title=tx_dict["title"],
        type=tx_dict["type"],
        category=tx_dict["category"],
        amount=tx_dict["amount"],
        date=tx_dict["date"],
        counterparty=tx_dict["counterparty"],
        paymentMethod=tx_dict["paymentMethod"],
        reference=tx_dict["reference"],
        referenceId=tx_dict["referenceId"],
        proofAttached=bool(tx_dict["proofFileName"]),
        proofFileName=tx_dict["proofFileName"] or None,
        proofDocument=tx_dict["proofDocument"] or None,
        notes=tx_dict["notes"],
        evidenceStatus=status,
        confidenceScore=ev["confidenceScore"],
        evidence={
            "status": status,
            "explanation": ev["explanation"],
            "explanationKey": ev.get("explanationKey", ""),
            "source": ev.get("source", "finproof-evidence-engine"),
        },
        metadata={
            "submittedVia": "FinProof API",
            "paymentChannel": tx_dict["paymentMethod"],
            "reconciliationStatus": (
                "Verified" if status == EvidenceStatus.VERIFIED
                else "Pending Verification"
            ),
            "dataSource": "SYNTHETIC",
        },
    )

    # Add to store and invalidate cache
    _store["transactions"].insert(0, tx_dict)
    _store["analysis_cache"] = None

    return response.model_dump()


# =============================================================
# 3. Financial Stats (aggregates)
# =============================================================

@app.get("/api/financial-stats")
def get_financial_stats():
    """Aggregate financial statistics."""
    txs = _store["transactions"]

    incomes = [t["amount"] for t in txs if t["type"] == "INCOME"]
    expenses = [t["amount"] for t in txs if t["type"] == "EXPENSE"]

    total_income = sum(incomes)
    total_expenses = sum(expenses)

    # Estimate monthly averages (assuming ~90 days = 3 months)
    months = 3
    monthly_income_avg = round(total_income / months) if months else 0
    monthly_expenses_avg = round(total_expenses / months) if months else 0

    return {
        "monthlyIncomeAvg": monthly_income_avg,
        "monthlyExpensesAvg": monthly_expenses_avg,
        "netMonthlyCashflow": monthly_income_avg - monthly_expenses_avg,
        "totalRecordedTurnover": round(total_income),
        "totalTransactionsCount": len(txs),
        "totalIncomeTransactions": len(incomes),
        "totalExpenseTransactions": len(expenses),
        "dataSource": "SYNTHETIC",
    }


# =============================================================
# 4. Monthly Cashflows
# =============================================================

@app.get("/api/cashflows")
def get_cashflows():
    """Monthly cashflow breakdown."""
    txs = _store["transactions"]

    # Group by month
    monthly: dict[str, dict] = {}
    for t in txs:
        try:
            dt = datetime.fromisoformat(t["date"].replace("Z", "+00:00")).replace(tzinfo=None)
            key = dt.strftime("%b %Y")
        except (ValueError, KeyError, AttributeError):
            continue

        if key not in monthly:
            monthly[key] = {"month": key, "income": 0, "expenses": 0}

        if t["type"] == "INCOME":
            monthly[key]["income"] += t["amount"]
        else:
            monthly[key]["expenses"] += t["amount"]

    result = []
    for m in sorted(monthly.values(), key=lambda x: x["month"]):
        m["net"] = round(m["income"] - m["expenses"])
        m["income"] = round(m["income"])
        m["expenses"] = round(m["expenses"])
        result.append(m)

    return result


# =============================================================
# 5. Full Analysis
# =============================================================

@app.get("/api/analysis")
def get_analysis():
    """
    Run full analysis and return behaviour metrics + anomalies.

    Compatible with the frontend's existing AnalysisResponse shape.
    """
    result = _run_analysis()

    # Convert behaviour metrics to frontend-compatible format
    metrics_response = []
    for i, m in enumerate(result["behaviour_metrics"]):
        metrics_response.append(
            AnalysisMetricResponse(
                id=f"metric_{i}",
                title=m.metric,
                value=m.level,
                status=m.level,
                description=m.what,
                factors=[m.why, m.evidence],
            ).model_dump()
        )

    # Convert anomalies to frontend-compatible format
    anomalies_response = []
    for a in result["anomalies"]:
        anomalies_response.append({
            "id": a.id,
            "transactionId": a.transaction_id,
            "title": a.title,
            "severity": a.severity,
            "date": a.date,
            "description": a.what,
            "status": "FLAGGED",
            "actionRequired": a.recommendation,
        })

    return {
        "metrics": metrics_response,
        "anomalies": anomalies_response,
    }


# =============================================================
# 6. Evidence Classification
# =============================================================

@app.get("/api/analysis/evidence")
def get_evidence_breakdown():
    """Retrieve evidence classification breakdown."""
    result = _get_analysis()
    eb = result["evidence_breakdown"]
    return {
        "breakdown": eb.model_dump(),
        "coverage": eb.evidence_coverage,
        "transaction_count": len(result["classified_transactions"]),
        "status_counts": {
            "verified": sum(
                1 for t in result["classified_transactions"]
                if t.evidenceStatus == EvidenceStatus.VERIFIED
            ),
            "corroborated": sum(
                1 for t in result["classified_transactions"]
                if t.evidenceStatus == EvidenceStatus.CORROBORATED
            ),
            "self_declared": sum(
                1 for t in result["classified_transactions"]
                if t.evidenceStatus == EvidenceStatus.SELF_DECLARED
            ),
            "mismatch": sum(
                1 for t in result["classified_transactions"]
                if t.evidenceStatus == EvidenceStatus.MISMATCH
            ),
        },
        "dataSource": "SYNTHETIC",
    }


# =============================================================
# 7. Financial Behaviour Analysis
# =============================================================

@app.get("/api/analysis/behaviour")
def get_behaviour_analysis():
    """Retrieve financial behaviour analysis with explanations."""
    result = _get_analysis()
    return {
        "metrics": [m.model_dump() for m in result["behaviour_metrics"]],
        "dataSource": "SYNTHETIC",
    }


# =============================================================
# 8. Anomaly Detection
# =============================================================

@app.get("/api/analysis/anomalies")
def get_anomalies():
    """Retrieve detected unusual activity."""
    result = _get_analysis()
    return {
        "anomalies": [a.model_dump() for a in result["anomalies"]],
        "count": len(result["anomalies"]),
        "note": (
            "Unusual activity does not indicate fraud. These transactions "
            "differ from the worker's normal observed pattern and may "
            "benefit from additional supporting evidence."
        ),
        "dataSource": "SYNTHETIC",
    }


# =============================================================
# 9. Complete Financial Profile
# =============================================================

@app.get("/api/financial-profile")
def get_financial_profile():
    """Retrieve the complete Digital Financial Profile."""
    result = _get_analysis()
    return result["profile"].model_dump()


# =============================================================
# 10. Lender-Ready Report
# =============================================================

@app.get("/api/lender-report")
def get_lender_report():
    """Retrieve the lender-ready evidence summary."""
    result = _get_analysis()
    return result["lender_report"].model_dump()


# =============================================================
# Health Check
# =============================================================

@app.get("/api/health")
def health_check():
    """Health check endpoint for React frontend connection status."""
    return {
        "status": "ok",
        "service": "FinFootprint API",
    }


# =============================================================
# Analysis Endpoints for Frontend Integration
# =============================================================

@app.post("/api/analyze/activity")
def analyze_activity(payload: ActivityAnalysisRequest):
    """
    Analyze a single financial activity using the Evidence Engine.
    Classifies into VERIFIED, CORROBORATED, SELF_DECLARED, or MISMATCH.
    """
    tx_dict = {
        "id": f"tx_{uuid.uuid4().hex[:8]}",
        "title": payload.title,
        "type": (payload.type or "INCOME").upper(),
        "category": payload.category or "General",
        "amount": float(payload.amount or 0),
        "date": payload.date or datetime.now().isoformat(),
        "counterparty": payload.counterparty or "",
        "paymentMethod": (payload.paymentMethod or "CASH").upper(),
        "reference": payload.reference or payload.referenceId or "",
        "referenceId": payload.reference or payload.referenceId or "",
        "proofFileName": payload.proofFileName or payload.proofDocument or "",
        "proofDocument": payload.proofFileName or payload.proofDocument or "",
        "notes": payload.notes or "",
    }

    # Generate supporting record for simulation & classify
    supporting = generate_supporting_record(tx_dict)
    ev = classify_evidence(tx_dict, supporting)

    status_val = ev["status"].value if hasattr(ev["status"], "value") else str(ev["status"])
    confidence_score = float(ev.get("confidenceScore", 50))
    score = round(confidence_score / 100.0, 2)

    # Determine risk level based on evidence classification
    if status_val in ("VERIFIED", "CORROBORATED"):
        risk_level = "LOW"
    elif status_val == "SELF_DECLARED":
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return {
        "success": True,
        "data": {
            "evidence": {
                "status": status_val,
                "score": score,
                "confidenceScore": confidence_score,
                "explanation": ev.get("explanation", "Supporting financial information processed."),
                "explanationKey": ev.get("explanationKey", f"evidence.assessments.{status_val.lower()}"),
                "source": ev.get("source", "finproof-evidence-engine"),
            },
            "analysis": {
                "riskLevel": risk_level,
            },
        },
    }


@app.post("/api/analyze/profile")
def analyze_profile(payload: ProfileAnalysisRequest):
    """
    Analyze a collection of activities using behaviour & anomaly ML engines.
    """
    activities = payload.activities or []
    if len(activities) < 3:
        return {
            "success": True,
            "data": {
                "hasSufficientData": False,
                "metrics": [],
                "anomalies": [],
            },
        }

    # Classify all transactions for evidence results
    evidence_results = []
    for a in activities:
        supp = generate_supporting_record(a)
        ev = classify_evidence(a, supp)
        evidence_results.append(ev)

    behaviour_metrics = analyse_financial_behaviour(activities, evidence_results)
    anomalies = detect_anomalies(activities, evidence_results)

    # Map to frontend-friendly structures
    metrics_out = []
    for i, m in enumerate(behaviour_metrics):
        metrics_out.append({
            "id": f"metric_{i}",
            "title": m.metric,
            "value": m.level,
            "status": m.level,
            "description": m.what,
            "factors": [m.why, m.evidence],
        })

    anomalies_out = []
    for a in anomalies:
        anomalies_out.append({
            "id": a.id,
            "transactionId": a.transaction_id,
            "title": a.title,
            "severity": a.severity,
            "date": a.date,
            "description": a.what,
            "status": "FLAGGED",
            "actionRequired": a.recommendation,
        })

    return {
        "success": True,
        "data": {
            "hasSufficientData": True,
            "metrics": metrics_out,
            "anomalies": anomalies_out,
        },
    }
