"""
Pydantic models for request/response schemas.

These models define the data contracts between the frontend and backend.
"""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# --- Enums ---

class TransactionType(str, Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class PaymentMethod(str, Enum):
    UPI = "UPI"
    BANK_TRANSFER = "BANK_TRANSFER"
    BANK = "BANK"
    CASH = "CASH"
    OTHER = "OTHER"


class EvidenceStatus(str, Enum):
    VERIFIED = "VERIFIED"
    CORROBORATED = "CORROBORATED"
    SELF_DECLARED = "SELF_DECLARED"
    MISMATCH = "MISMATCH"


class BehaviourLevel(str, Enum):
    HIGH = "HIGH"
    MODERATE = "MODERATE"
    LOW = "LOW"


class CashflowLevel(str, Enum):
    GOOD = "GOOD"
    MODERATE = "MODERATE"
    POOR = "POOR"


# --- Request Models ---

class TransactionCreate(BaseModel):
    """Payload for adding a new financial activity."""
    title: str
    type: TransactionType = TransactionType.INCOME
    category: str = "General"
    amount: float = Field(gt=0)
    date: str  # ISO date string
    counterparty: str = ""
    paymentMethod: PaymentMethod = PaymentMethod.CASH
    reference: str = ""
    referenceId: str = ""
    invoiceNumber: str = ""
    proofFileName: str = ""
    proofDocument: str = ""
    notes: str = ""


class ActivityAnalysisRequest(BaseModel):
    """Payload for analyzing a financial activity via REST API."""
    title: str = ""
    type: str = "INCOME"
    category: str = "General"
    amount: float = Field(default=0)
    date: str = ""
    counterparty: str = ""
    paymentMethod: str = "CASH"
    reference: str = ""
    referenceId: str = ""
    invoiceNumber: str = ""
    proofFileName: str = ""
    proofDocument: str = ""
    notes: str = ""
    proofAttached: bool = False


class ProfileAnalysisRequest(BaseModel):
    """Payload for analyzing multiple financial activities."""
    activities: list[dict] = []


# --- Evidence Models ---

class EvidenceDetail(BaseModel):
    status: EvidenceStatus
    explanation: str
    explanationKey: str = ""
    source: str = "finproof-evidence-engine"


class EvidenceExplanation(BaseModel):
    what: str
    why: str
    evidence: str


# --- Transaction Response ---

class TransactionResponse(BaseModel):
    id: str
    title: str
    type: TransactionType
    category: str
    amount: float
    date: str
    counterparty: str
    paymentMethod: PaymentMethod
    reference: str
    referenceId: str
    proofAttached: bool
    proofFileName: Optional[str] = None
    proofDocument: Optional[str] = None
    notes: str
    evidenceStatus: EvidenceStatus
    confidenceScore: float
    evidence: EvidenceDetail
    anomaly_flag: bool = False
    anomaly_reason: Optional[str] = None
    metadata: dict = {}


# --- Behaviour Analysis Models ---

class BehaviourMetric(BaseModel):
    """A single financial behaviour dimension with explanation."""
    metric: str
    level: str  # HIGH / MODERATE / LOW / GOOD / POOR
    what: str
    why: str
    evidence: str


class AnomalyRecord(BaseModel):
    """A detected unusual transaction."""
    id: str
    transaction_id: str
    title: str
    severity: str  # LOW / MEDIUM / HIGH
    date: str
    what: str
    why: str
    evidence: str
    recommendation: str


# --- Financial Profile Models ---

class EvidenceBreakdown(BaseModel):
    verified_pct: float
    corroborated_pct: float
    self_declared_pct: float
    mismatch_pct: float
    evidence_coverage: float  # verified + corroborated


class FinancialProfile(BaseModel):
    """The complete Digital Financial Profile."""
    worker_information: dict
    observation_period: dict
    financial_metrics: list[BehaviourMetric]
    evidence_breakdown: EvidenceBreakdown
    evidence_coverage: float
    anomalies: list[AnomalyRecord]
    insights: list[str]
    limitations: list[str]
    data_source: str = "SYNTHETIC"


# --- Analysis Metrics (frontend-compatible) ---

class AnalysisMetricResponse(BaseModel):
    id: str
    title: str
    value: str | int | float
    max: Optional[int] = None
    status: str
    description: str
    trend: Optional[str] = None
    benchmark: Optional[str] = None
    factors: list[str] = []


class AnalysisResponse(BaseModel):
    metrics: list[AnalysisMetricResponse]
    anomalies: list[dict]


# --- Lender Report ---

class LenderReport(BaseModel):
    """Lender-ready evidence summary."""
    report_id: str
    generated_date: str
    worker_information: dict
    observation_period: dict
    financial_behaviour: list[BehaviourMetric]
    evidence_summary: EvidenceBreakdown
    evidence_coverage: float
    anomaly_count: int
    anomaly_details: list[AnomalyRecord]
    overall_interpretation: str
    limitations: list[str]
    data_source: str = "SYNTHETIC"
