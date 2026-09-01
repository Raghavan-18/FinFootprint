"""
Evidence Classification Engine for FinProof.

Classifies each financial activity into one of four evidence tiers:
  - VERIFIED: Independent supporting evidence matches the declaration.
  - CORROBORATED: No direct proof, but supporting information provides support.
  - SELF_DECLARED: No independent supporting evidence.
  - MISMATCH: Independent evidence conflicts with the declaration.

IMPORTANT:
  - A mismatch does NOT indicate fraud.
  - Self-declared information is NOT assumed to be false.
  - The system communicates evidence strength, not absolute truth.
"""

from __future__ import annotations

from app.models import EvidenceStatus


def classify_evidence(transaction: dict, supporting_record: dict | None) -> dict:
    """
    Classify a single financial activity based on available evidence.

    Args:
        transaction: The declared financial activity.
        supporting_record: A simulated supporting record (or None).

    Returns:
        Dictionary with evidence status, explanation, and confidence.
    """

    method = (transaction.get("paymentMethod") or "CASH").upper()
    ref = (transaction.get("reference") or transaction.get("referenceId") or "").strip()
    has_ref = bool(ref)
    proof = transaction.get("proofFileName") or transaction.get("proofDocument") or ""
    has_proof = bool(str(proof).strip())
    declared_amount = transaction.get("amount", 0)

    # --- Check supporting record ---
    if supporting_record is not None:
        recorded_amount = supporting_record.get("amount", 0)
        record_matches = supporting_record.get("match", False)

        if not record_matches:
            # Supporting record exists but conflicts
            return {
                "status": EvidenceStatus.MISMATCH,
                "explanation": (
                    "Available supporting information shows a different amount "
                    f"(₹{recorded_amount:,.0f}) compared to the declared amount "
                    f"(₹{declared_amount:,.0f}). This does not indicate fraud — "
                    "the difference may benefit from additional clarification."
                ),
                "explanationKey": "evidence.assessments.mismatch",
                "confidenceScore": 20,
                "source": "finproof-evidence-engine",
                "evidence_detail": {
                    "what": "A discrepancy exists between the declared amount and available records.",
                    "why": (
                        f"The declared amount is ₹{declared_amount:,.0f} but the "
                        f"supporting record shows ₹{recorded_amount:,.0f}."
                    ),
                    "evidence": (
                        "A supporting financial record exists but the amounts "
                        "do not match. Additional documentation may help clarify."
                    ),
                },
            }

        # Supporting record matches
        if method in ("UPI", "BANK_TRANSFER", "BANK") and has_ref:
            return {
                "status": EvidenceStatus.VERIFIED,
                "explanation": (
                    "Supporting financial information is consistent with "
                    "the recorded activity. The transaction amount, date, and "
                    "reference match the available supporting record."
                ),
                "explanationKey": "evidence.assessments.verified",
                "confidenceScore": 95,
                "source": "finproof-evidence-engine",
                "evidence_detail": {
                    "what": "This financial activity has matching independent evidence.",
                    "why": (
                        "The declared amount, date, and payment reference match "
                        "the supporting financial record."
                    ),
                    "evidence": (
                        f"Supporting record confirms ₹{declared_amount:,.0f} via "
                        f"{method} with reference {ref}."
                    ),
                },
            }

        # Has supporting record but not full digital trail
        return {
            "status": EvidenceStatus.CORROBORATED,
            "explanation": (
                "Additional supporting information is available and consistent, "
                "but full independent verification is not complete."
            ),
            "explanationKey": "evidence.assessments.corroborated",
            "confidenceScore": 75,
            "source": "finproof-evidence-engine",
            "evidence_detail": {
                "what": "Supporting information partially supports this activity.",
                "why": (
                    "A supporting record exists and the amount matches, but the "
                    "transaction lacks a fully verifiable digital trail."
                ),
                "evidence": (
                    "Supporting document or partial record available. "
                    "Independent verification is not complete."
                ),
            },
        }

    # --- No supporting record ---

    # Digital channel with reference and proof → corroborated
    if method in ("UPI", "BANK_TRANSFER", "BANK") and has_ref and has_proof:
        return {
            "status": EvidenceStatus.CORROBORATED,
            "explanation": (
                "The transaction was made through a digital channel with a "
                "reference number and supporting document, but no independent "
                "financial record has been matched."
            ),
            "explanationKey": "evidence.assessments.corroborated",
            "confidenceScore": 70,
            "source": "finproof-evidence-engine",
            "evidence_detail": {
                "what": "Digital payment channel with reference and proof document.",
                "why": (
                    "A digital payment reference and supporting document exist, "
                    "providing partial support for the declaration."
                ),
                "evidence": (
                    f"Payment method: {method}, Reference: {ref}, "
                    f"Proof document: {proof}."
                ),
            },
        }

    # Digital channel with reference but no proof → corroborated (lower)
    if method in ("UPI", "BANK_TRANSFER", "BANK") and has_ref:
        return {
            "status": EvidenceStatus.CORROBORATED,
            "explanation": (
                "The transaction uses a digital payment channel with a "
                "reference identifier but no supporting document is attached."
            ),
            "explanationKey": "evidence.assessments.corroborated",
            "confidenceScore": 60,
            "source": "finproof-evidence-engine",
            "evidence_detail": {
                "what": "Digital payment channel with reference but no proof document.",
                "why": (
                    "A verifiable reference exists, providing some support, "
                    "but no proof document is attached."
                ),
                "evidence": f"Payment method: {method}, Reference: {ref}.",
            },
        }

    # Has proof document only → corroborated (weak)
    if has_proof:
        return {
            "status": EvidenceStatus.CORROBORATED,
            "explanation": (
                "A supporting document is attached but no independent "
                "financial record or digital reference is available."
            ),
            "explanationKey": "evidence.assessments.corroborated",
            "confidenceScore": 55,
            "source": "finproof-evidence-engine",
            "evidence_detail": {
                "what": "A proof document is available.",
                "why": "A document was provided, offering some corroboration.",
                "evidence": f"Proof document: {proof}. No digital reference.",
            },
        }

    # No supporting record, no reference, no proof → self-declared
    return {
        "status": EvidenceStatus.SELF_DECLARED,
        "explanation": (
            "No independent supporting evidence is currently available for "
            "this financial activity. The information is provided by the worker. "
            "This does not mean the information is false."
        ),
        "explanationKey": "evidence.assessments.selfDeclared",
        "confidenceScore": 40,
        "source": "finproof-evidence-engine",
        "evidence_detail": {
            "what": "This activity is currently self-declared.",
            "why": (
                "No supporting financial record, digital reference, or "
                "proof document is available."
            ),
            "evidence": "No independent evidence. Worker declaration only.",
        },
    }
