"""
ML Module for FinProof.

Two distinct ML capabilities:

1. FINANCIAL BEHAVIOUR ANALYSIS
   Analyses the worker's financial patterns and produces understandable
   behaviour categories (HIGH / MODERATE / LOW) with explanations.

2. UNUSUAL ACTIVITY DETECTION (Anomaly Detection)
   Identifies transactions that differ significantly from the worker's
   normal observed behaviour.

IMPORTANT:
  - This is NOT a credit score.
  - Anomalies are NOT fraud indicators.
  - All results include human-readable explanations.
"""

from __future__ import annotations

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from app.models import BehaviourMetric, AnomalyRecord


# ============================================================
# 1. FINANCIAL BEHAVIOUR ANALYSIS
# ============================================================

def _classify_level(value: float, high_thresh: float, low_thresh: float) -> str:
    """Classify a numeric value into HIGH / MODERATE / LOW."""
    if value >= high_thresh:
        return "HIGH"
    elif value >= low_thresh:
        return "MODERATE"
    return "LOW"


def _coefficient_of_variation(values: list[float]) -> float:
    """CV = std / mean. Lower CV = more stable."""
    if not values or np.mean(values) == 0:
        return 1.0
    return float(np.std(values) / np.mean(values))


def analyse_financial_behaviour(
    transactions: list[dict],
    evidence_results: list[dict],
) -> list[BehaviourMetric]:
    """
    Analyse a worker's financial behaviour from their transaction history.

    Returns a list of BehaviourMetric objects with:
    - metric name
    - level (HIGH / MODERATE / LOW / GOOD / POOR)
    - what / why / evidence explanations
    """
    incomes = [t for t in transactions if t.get("type") == "INCOME"]
    expenses = [t for t in transactions if t.get("type") == "EXPENSE"]

    income_amounts = [t["amount"] for t in incomes]
    expense_amounts = [t["amount"] for t in expenses]
    all_amounts = [t["amount"] for t in transactions]

    # Parse dates for frequency analysis
    from datetime import datetime
    def _parse_date(s: str) -> datetime | None:
        """Parse date string, normalizing to naive datetime."""
        try:
            dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
            return dt.replace(tzinfo=None)  # Normalize to naive
        except (ValueError, KeyError, AttributeError):
            try:
                return datetime.strptime(s, "%Y-%m-%d")
            except (ValueError, KeyError):
                return None

    dates = [d for d in (_parse_date(t["date"]) for t in transactions) if d]
    income_dates = [d for d in (_parse_date(t["date"]) for t in incomes) if d]

    metrics = []

    # --- Income Stability ---
    if income_amounts:
        # Use robust CV: filter outliers via IQR to assess typical income stability
        q1 = float(np.percentile(income_amounts, 25))
        q3 = float(np.percentile(income_amounts, 75))
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        regular_incomes = [a for a in income_amounts if lower <= a <= upper]
        cv = _coefficient_of_variation(regular_incomes) if regular_incomes else _coefficient_of_variation(income_amounts)
        stability = 1.0 - min(cv, 1.0)  # Higher = more stable
        level = _classify_level(stability, 0.7, 0.4)

        reasons = []
        if cv < 0.3:
            reasons.append("Income variation is relatively low across the observation period.")
        elif cv < 0.5:
            reasons.append("Income shows moderate variation but remains reasonably consistent.")
        else:
            reasons.append("Income varies considerably across the observation period.")

        if len(income_amounts) >= 10:
            reasons.append(f"Based on {len(income_amounts)} recorded income transactions.")
        else:
            reasons.append(f"Based on limited data ({len(income_amounts)} income records).")

        # Check for major fluctuations
        if income_amounts:
            max_inc = max(income_amounts)
            min_inc = min(income_amounts)
            median_inc = float(np.median(income_amounts))
            if max_inc > median_inc * 3:
                reasons.append("Some unusually large income transactions were observed.")
            elif max_inc < median_inc * 2:
                reasons.append("No major fluctuations were observed in regular income.")

        verified_income = sum(
            1 for i, t in enumerate(incomes)
            if i < len(evidence_results)
            and evidence_results[transactions.index(t)].get("status", "").value
            in ("VERIFIED", "CORROBORATED")
        )

        metrics.append(BehaviourMetric(
            metric="Income Stability",
            level=level,
            what="Assessment of how stable recorded income is over time.",
            why=" ".join(reasons),
            evidence=f"{len(income_amounts)} income records analysed, "
                     f"coefficient of variation: {cv:.2f}.",
        ))

    # --- Transaction Regularity ---
    if len(dates) >= 2:
        dates_sorted = sorted(dates)
        # Use active-days ratio: what fraction of days had transactions?
        unique_days = len(set(d.date() for d in dates_sorted))
        total_span = (dates_sorted[-1] - dates_sorted[0]).days + 1
        active_ratio = unique_days / total_span if total_span > 0 else 0

        # Also compute average gap between unique active days
        unique_dates = sorted(set(d.date() for d in dates_sorted))
        if len(unique_dates) >= 2:
            day_gaps = [(unique_dates[i + 1] - unique_dates[i]).days
                        for i in range(len(unique_dates) - 1)]
            avg_gap = float(np.mean(day_gaps))
        else:
            avg_gap = 0
            day_gaps = []

        level = _classify_level(active_ratio, 0.6, 0.3)

        reasons = []
        if active_ratio >= 0.7:
            reasons.append("Transactions occur on most days within the observation period.")
        elif active_ratio >= 0.4:
            reasons.append("Transactions occur regularly, several days per week on average.")
        else:
            reasons.append("Transactions are relatively infrequent.")

        if avg_gap <= 2:
            reasons.append("The average gap between active days is short.")
        elif avg_gap <= 4:
            reasons.append("Active days are spaced a few days apart on average.")
        else:
            reasons.append("There are notable gaps between active transaction days.")


        metrics.append(BehaviourMetric(
            metric="Transaction Regularity",
            level=level,
            what="Assessment of how regularly the worker conducts financial transactions.",
            why=" ".join(reasons),
            evidence=f"{unique_days} active days out of {total_span} days "
                     f"({active_ratio * 100:.0f}% active), "
                     f"average gap: {avg_gap:.1f} days.",
        ))

    # --- Savings Behaviour ---
    savings_txs = [t for t in expenses if t.get("category", "").lower() in
                   ("savings", "savings deposit", "investment")]
    total_income = sum(income_amounts) if income_amounts else 1
    total_savings = sum(t["amount"] for t in savings_txs)
    savings_rate = total_savings / total_income if total_income > 0 else 0

    if savings_rate >= 0.15:
        level = "HIGH"
    elif savings_rate >= 0.05:
        level = "MODERATE"
    else:
        level = "LOW"

    reasons = []
    if savings_txs:
        reasons.append(f"{len(savings_txs)} savings transactions recorded.")
        reasons.append(f"Savings represent approximately {savings_rate * 100:.1f}% of total income.")
    else:
        reasons.append("No explicit savings transactions were recorded.")
        reasons.append("This may indicate informal savings not captured in the records.")

    metrics.append(BehaviourMetric(
        metric="Savings Behaviour",
        level=level,
        what="Assessment of the worker's observed savings activity.",
        why=" ".join(reasons),
        evidence=f"Total income: ₹{total_income:,.0f}, "
                 f"Total recorded savings: ₹{total_savings:,.0f}.",
    ))

    # --- Cash-flow Stability ---
    if income_amounts and expense_amounts:
        total_expenses = sum(expense_amounts)
        net_cashflow = total_income - total_expenses
        expense_ratio = total_expenses / total_income if total_income > 0 else 1

        if net_cashflow > 0 and expense_ratio < 0.65:
            level = "GOOD"
        elif net_cashflow > 0 and expense_ratio < 0.85:
            level = "MODERATE"
        else:
            level = "POOR"

        reasons = []
        if net_cashflow > 0:
            reasons.append(f"Net cash-flow is positive (₹{net_cashflow:,.0f} over the period).")
        else:
            reasons.append(f"Net cash-flow is negative (₹{net_cashflow:,.0f} over the period).")

        reasons.append(f"Expenses represent {expense_ratio * 100:.1f}% of income.")

        if expense_ratio < 0.6:
            reasons.append("Expense management appears disciplined relative to income.")
        elif expense_ratio < 0.8:
            reasons.append("Expenses are moderate relative to income.")
        else:
            reasons.append("Expenses are high relative to income.")

        metrics.append(BehaviourMetric(
            metric="Cash-flow Stability",
            level=level,
            what="Assessment of net cash-flow over the observation period.",
            why=" ".join(reasons),
            evidence=f"Total income: ₹{total_income:,.0f}, "
                     f"Total expenses: ₹{total_expenses:,.0f}, "
                     f"Net: ₹{net_cashflow:,.0f}.",
        ))

    # --- Repayment Consistency ---
    repayment_txs = [t for t in expenses if "repayment" in t.get("category", "").lower()
                     or "loan" in t.get("category", "").lower()
                     or "emi" in t.get("title", "").lower()]
    if repayment_txs:
        repay_amounts = [t["amount"] for t in repayment_txs]
        repay_cv = _coefficient_of_variation(repay_amounts)
        level = _classify_level(1.0 - min(repay_cv, 1.0), 0.7, 0.4)

        reasons = []
        reasons.append(f"{len(repayment_txs)} repayment transactions recorded.")
        if repay_cv < 0.1:
            reasons.append("Repayment amounts are very consistent.")
        elif repay_cv < 0.3:
            reasons.append("Repayment amounts are reasonably consistent.")
        else:
            reasons.append("Repayment amounts vary.")

        metrics.append(BehaviourMetric(
            metric="Repayment Consistency",
            level=level,
            what="Assessment of loan/credit repayment regularity.",
            why=" ".join(reasons),
            evidence=f"{len(repayment_txs)} repayments totalling "
                     f"₹{sum(repay_amounts):,.0f}.",
        ))

    # --- Evidence Coverage ---
    verified_count = sum(
        1 for e in evidence_results
        if e.get("status") and e["status"].value in ("VERIFIED", "CORROBORATED")
    )
    total_count = len(evidence_results) if evidence_results else 1
    coverage = verified_count / total_count

    if coverage >= 0.7:
        level = "HIGH"
    elif coverage >= 0.4:
        level = "MODERATE"
    else:
        level = "LOW"

    metrics.append(BehaviourMetric(
        metric="Evidence Coverage",
        level=level,
        what="Proportion of financial activity supported by evidence.",
        why=f"{verified_count} of {total_count} transactions are verified or corroborated.",
        evidence=f"Evidence coverage: {coverage * 100:.1f}%.",
    ))

    return metrics


# ============================================================
# 2. UNUSUAL ACTIVITY DETECTION (Anomaly Detection)
# ============================================================

def detect_anomalies(
    transactions: list[dict],
    evidence_results: list[dict],
) -> list[AnomalyRecord]:
    """
    Detect unusual financial activity using Isolation Forest.

    Features used:
    - Transaction amount
    - Deviation from mean amount for that transaction type
    - Day of week

    IMPORTANT: Anomaly does NOT mean fraud. It means the transaction
    differs significantly from the worker's normal observed pattern.
    """
    if len(transactions) < 5:
        return []

    # Separate by type for per-type statistics
    income_amounts = [t["amount"] for t in transactions if t["type"] == "INCOME"]
    expense_amounts = [t["amount"] for t in transactions if t["type"] == "EXPENSE"]

    income_mean = float(np.mean(income_amounts)) if income_amounts else 0
    income_std = float(np.std(income_amounts)) if income_amounts else 1
    expense_mean = float(np.mean(expense_amounts)) if expense_amounts else 0
    expense_std = float(np.std(expense_amounts)) if expense_amounts else 1

    # Build feature matrix
    features = []
    valid_indices = []

    for i, t in enumerate(transactions):
        amount = t["amount"]
        if t["type"] == "INCOME":
            z_score = (amount - income_mean) / income_std if income_std > 0 else 0
        else:
            z_score = (amount - expense_mean) / expense_std if expense_std > 0 else 0

        # Day of week feature
        try:
            from datetime import datetime
            dt = datetime.fromisoformat(t["date"].replace("Z", "+00:00")).replace(tzinfo=None)
            day_of_week = dt.weekday()
        except (ValueError, KeyError, AttributeError):
            day_of_week = 3  # default mid-week

        features.append([amount, abs(z_score), day_of_week])
        valid_indices.append(i)

    if len(features) < 5:
        return []

    X = np.array(features)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Isolation Forest for anomaly detection
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.08,  # Expect ~8% anomalies
        random_state=42,
    )
    predictions = iso_forest.fit_predict(X_scaled)
    scores = iso_forest.decision_function(X_scaled)

    anomalies = []
    anomaly_count = 0

    for idx, (pred, score) in enumerate(zip(predictions, scores)):
        if pred == -1:  # Anomaly
            tx_idx = valid_indices[idx]
            t = transactions[tx_idx]
            amount = t["amount"]

            # Determine severity based on score
            if score < -0.3:
                severity = "HIGH"
            elif score < -0.15:
                severity = "MEDIUM"
            else:
                severity = "LOW"

            # Get the relevant mean for context
            if t["type"] == "INCOME":
                type_mean = income_mean
                type_label = "income"
            else:
                type_mean = expense_mean
                type_label = "expense"

            # Evidence context
            ev = evidence_results[tx_idx] if tx_idx < len(evidence_results) else {}
            ev_status = ev.get("status", "")
            if hasattr(ev_status, "value"):
                ev_status = ev_status.value

            anomaly_count += 1
            anomalies.append(AnomalyRecord(
                id=f"anom_{anomaly_count:03d}",
                transaction_id=t["id"],
                title=t["title"],
                severity=severity,
                date=t["date"],
                what=(
                    f"This {type_label} transaction of ₹{amount:,.0f} differs "
                    f"significantly from the observed {type_label} pattern "
                    f"(average: ₹{type_mean:,.0f})."
                ),
                why=(
                    f"The transaction amount is substantially "
                    f"{'higher' if amount > type_mean else 'lower'} than the "
                    f"worker's typical {type_label} activity. This does not "
                    f"indicate any wrongdoing — it may represent a genuine "
                    f"one-time event."
                ),
                evidence=(
                    f"Current evidence status: {ev_status or 'Unknown'}. "
                    f"This transaction may benefit from additional supporting evidence."
                    if ev_status != "VERIFIED" else
                    f"Current evidence status: VERIFIED. "
                    f"Supporting records confirm this transaction."
                ),
                recommendation=(
                    "This transaction differs significantly from the observed "
                    "financial pattern and may benefit from additional "
                    "supporting evidence."
                ),
            ))

    return anomalies
