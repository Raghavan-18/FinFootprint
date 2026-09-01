"""
Profile Generator for FinProof.

Orchestrates the full analysis pipeline:
  1. Classify evidence for all transactions
  2. Analyse financial behaviour (ML)
  3. Detect anomalies (ML)
  4. Generate the Digital Financial Profile
  5. Generate lender-ready summary

This module connects evidence_engine and ml_engine to produce
the final structured output.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from app.evidence_engine import classify_evidence
from app.ml_engine import analyse_financial_behaviour, detect_anomalies
from app.models import (
    AnomalyRecord,
    BehaviourMetric,
    EvidenceBreakdown,
    EvidenceStatus,
    FinancialProfile,
    LenderReport,
    TransactionResponse,
)
from app.synthetic_data import generate_supporting_record


# Standard limitations that must always be communicated
SYSTEM_LIMITATIONS = [
    "Self-declared information is not independently verified.",
    "An anomaly does not prove fraud.",
    "Synthetic data is being used for this MVP.",
    "Real financial integrations are not implemented.",
    "Financial behaviour analysis is not a credit score.",
    "The profile does not guarantee loan approval.",
    "Final credit decisions belong to lenders.",
]


def run_full_analysis(worker: dict, transactions: list[dict]) -> dict:
    """
    Run the complete FinProof analysis pipeline.

    Pipeline:
        Retrieve financial activity
            ↓
        Validate data
            ↓
        Classify evidence
            ↓
        Calculate financial features
            ↓
        Analyse financial behaviour
            ↓
        Detect unusual activity
            ↓
        Generate explanations
            ↓
        Generate financial profile
            ↓
        Return structured result

    Returns a dict containing:
        - classified_transactions
        - behaviour_metrics
        - anomalies
        - profile
        - lender_report
    """

    # Step 1: Validate and classify evidence
    evidence_results = []
    classified_transactions = []

    for tx in transactions:
        # Generate a simulated supporting record
        supporting = generate_supporting_record(tx)

        # Classify evidence
        ev = classify_evidence(tx, supporting)

        evidence_results.append(ev)

        # Build response transaction
        status = ev["status"]
        classified_tx = TransactionResponse(
            id=tx["id"],
            title=tx["title"],
            type=tx["type"],
            category=tx.get("category", "General"),
            amount=tx["amount"],
            date=tx["date"],
            counterparty=tx.get("counterparty", ""),
            paymentMethod=tx.get("paymentMethod", "CASH"),
            reference=tx.get("reference", ""),
            referenceId=tx.get("referenceId", ""),
            proofAttached=bool(tx.get("proofFileName")),
            proofFileName=tx.get("proofFileName"),
            proofDocument=tx.get("proofDocument"),
            notes=tx.get("notes", ""),
            evidenceStatus=status,
            confidenceScore=ev["confidenceScore"],
            evidence={
                "status": status,
                "explanation": ev["explanation"],
                "explanationKey": ev.get("explanationKey", ""),
                "source": ev.get("source", "finproof-evidence-engine"),
            },
            anomaly_flag=False,
            anomaly_reason=None,
            metadata={
                "submittedVia": "FinProof System",
                "paymentChannel": tx.get("paymentMethod", "CASH"),
                "reconciliationStatus": (
                    "Verified" if status == EvidenceStatus.VERIFIED
                    else "Pending Verification"
                ),
                "dataSource": "SYNTHETIC",
            },
        )
        classified_transactions.append(classified_tx)

    # Step 2: Analyse financial behaviour
    behaviour_metrics = analyse_financial_behaviour(transactions, evidence_results)

    # Step 3: Detect anomalies
    anomalies = detect_anomalies(transactions, evidence_results)

    # Mark anomalous transactions
    anomaly_tx_ids = {a.transaction_id for a in anomalies}
    for ct in classified_transactions:
        if ct.id in anomaly_tx_ids:
            ct.anomaly_flag = True
            matching = next((a for a in anomalies if a.transaction_id == ct.id), None)
            if matching:
                ct.anomaly_reason = matching.recommendation

    # Step 4: Compute evidence breakdown
    total = len(evidence_results)
    if total == 0:
        total = 1  # avoid division by zero

    status_counts = {
        "VERIFIED": 0,
        "CORROBORATED": 0,
        "SELF_DECLARED": 0,
        "MISMATCH": 0,
    }
    for ev in evidence_results:
        s = ev["status"]
        key = s.value if hasattr(s, "value") else str(s)
        if key in status_counts:
            status_counts[key] += 1

    evidence_breakdown = EvidenceBreakdown(
        verified_pct=round(status_counts["VERIFIED"] / total * 100, 1),
        corroborated_pct=round(status_counts["CORROBORATED"] / total * 100, 1),
        self_declared_pct=round(status_counts["SELF_DECLARED"] / total * 100, 1),
        mismatch_pct=round(status_counts["MISMATCH"] / total * 100, 1),
        evidence_coverage=round(
            (status_counts["VERIFIED"] + status_counts["CORROBORATED"]) / total * 100, 1
        ),
    )

    # Step 5: Generate insights
    insights = _generate_insights(behaviour_metrics, evidence_breakdown, anomalies)

    # Step 6: Compute observation period
    dates = []
    for tx in transactions:
        try:
            dates.append(
                datetime.fromisoformat(tx["date"].replace("Z", "+00:00")).replace(tzinfo=None)
            )
        except (ValueError, KeyError, AttributeError):
            pass

    if dates:
        earliest = min(dates)
        latest = max(dates)
        days = (latest - earliest).days
    else:
        earliest = latest = datetime.now()
        days = 0

    observation_period = {
        "start": earliest.strftime("%Y-%m-%d"),
        "end": latest.strftime("%Y-%m-%d"),
        "days": days,
        "description": f"{days} Days",
    }

    # Step 7: Build the Digital Financial Profile
    profile = FinancialProfile(
        worker_information={
            "name": worker.get("full_name", "Unknown"),
            "occupation": worker.get("occupation", "Unknown"),
            "city": worker.get("city", ""),
            "member_since": worker.get("member_since", ""),
            "data_source": "SYNTHETIC",
        },
        observation_period=observation_period,
        financial_metrics=behaviour_metrics,
        evidence_breakdown=evidence_breakdown,
        evidence_coverage=evidence_breakdown.evidence_coverage,
        anomalies=anomalies,
        insights=insights,
        limitations=SYSTEM_LIMITATIONS,
        data_source="SYNTHETIC",
    )

    # Step 8: Build lender-ready report
    lender_report = LenderReport(
        report_id=f"FP-{uuid.uuid4().hex[:8].upper()}",
        generated_date=datetime.now().isoformat(),
        worker_information=profile.worker_information,
        observation_period=observation_period,
        financial_behaviour=behaviour_metrics,
        evidence_summary=evidence_breakdown,
        evidence_coverage=evidence_breakdown.evidence_coverage,
        anomaly_count=len(anomalies),
        anomaly_details=anomalies,
        overall_interpretation=_generate_overall_interpretation(
            behaviour_metrics, evidence_breakdown, anomalies
        ),
        limitations=SYSTEM_LIMITATIONS,
        data_source="SYNTHETIC",
    )

    return {
        "classified_transactions": classified_transactions,
        "behaviour_metrics": behaviour_metrics,
        "anomalies": anomalies,
        "evidence_breakdown": evidence_breakdown,
        "profile": profile,
        "lender_report": lender_report,
    }


def _generate_insights(
    metrics: list[BehaviourMetric],
    evidence: EvidenceBreakdown,
    anomalies: list[AnomalyRecord],
) -> list[str]:
    """Generate human-readable insight statements."""
    insights = []

    for m in metrics:
        if m.metric == "Income Stability":
            if m.level == "HIGH":
                insights.append(
                    "Income activity appears relatively stable over the observation period."
                )
            elif m.level == "MODERATE":
                insights.append(
                    "Income shows moderate stability with some variation."
                )
            else:
                insights.append(
                    "Income activity shows significant variation over the observation period."
                )

        if m.metric == "Transaction Regularity":
            if m.level in ("HIGH",):
                insights.append("Transaction activity is regular and consistent.")
            else:
                insights.append("Transaction activity shows some irregularity.")

        if m.metric == "Cash-flow Stability":
            if m.level == "GOOD":
                insights.append("Cash-flow is positive and appears stable.")
            elif m.level == "MODERATE":
                insights.append("Cash-flow is positive but with moderate pressure.")

    if evidence.evidence_coverage >= 70:
        insights.append(
            f"Most observed financial activity ({evidence.evidence_coverage:.0f}%) "
            f"has supporting evidence."
        )
    elif evidence.evidence_coverage >= 40:
        insights.append(
            f"Some financial activity ({evidence.evidence_coverage:.0f}%) has supporting "
            f"evidence, while a significant portion remains self-declared."
        )
    else:
        insights.append(
            "A large proportion of financial activity is currently self-declared "
            "and would benefit from additional supporting evidence."
        )

    if evidence.mismatch_pct > 0:
        insights.append(
            f"A small number of records ({evidence.mismatch_pct:.1f}%) show "
            f"discrepancies that may require clarification."
        )

    if anomalies:
        insights.append(
            f"{len(anomalies)} unusual transaction(s) were detected and may "
            f"benefit from further review."
        )

    return insights


def _generate_overall_interpretation(
    metrics: list[BehaviourMetric],
    evidence: EvidenceBreakdown,
    anomalies: list[AnomalyRecord],
) -> str:
    """Generate a paragraph-level overall interpretation."""
    parts = []

    income_metric = next((m for m in metrics if m.metric == "Income Stability"), None)
    regularity_metric = next((m for m in metrics if m.metric == "Transaction Regularity"), None)

    if income_metric:
        if income_metric.level == "HIGH":
            parts.append("Income activity appears relatively stable")
        elif income_metric.level == "MODERATE":
            parts.append("Income activity shows moderate stability")
        else:
            parts.append("Income activity shows significant variation")

    if regularity_metric:
        if regularity_metric.level == "HIGH":
            parts.append("and transaction activity is regular")
        else:
            parts.append("with some irregularity in transaction timing")

    parts_str = " ".join(parts) + ". " if parts else ""

    evidence_str = (
        f"Approximately {evidence.evidence_coverage:.0f}% of observed financial "
        f"activity has supporting evidence (verified or corroborated), "
        f"while {evidence.self_declared_pct:.0f}% remains self-declared."
    )

    anomaly_str = ""
    if anomalies:
        anomaly_str = (
            f" {len(anomalies)} unusual transaction(s) were identified that "
            f"may benefit from further review."
        )

    disclaimer = (
        " This analysis is based on synthetic data and does not constitute "
        "a credit assessment or loan approval recommendation."
    )

    return parts_str + evidence_str + anomaly_str + disclaimer
