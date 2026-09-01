"""
Synthetic Data Generator for FinProof MVP.

Generates realistic financial activity data for an informal worker,
including income, expenses, savings, repayments, and supporting records.

IMPORTANT: All data generated here is SYNTHETIC and for demonstration only.
No real bank data or financial integrations are used.
"""

from __future__ import annotations

import random
import uuid
from datetime import datetime, timedelta


def _id() -> str:
    return f"tx_{uuid.uuid4().hex[:8]}"


def _date_str(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def generate_supporting_record(tx: dict) -> dict | None:
    """
    Simulate a supporting financial record from a hypothetical
    data provider (e.g., bank statement, UPI record).

    In a real system, this would come from consent-based financial
    data providers. For the MVP, we simulate it.
    """
    method = tx["paymentMethod"]
    amount = tx["amount"]

    # Cash transactions have no supporting record
    if method == "CASH" and not tx.get("proofFileName"):
        return None

    # Simulate a small chance of mismatch
    if random.random() < 0.06:
        # Amount differs from declared
        recorded_amount = round(amount * random.uniform(0.4, 0.8), 2)
        return {
            "source": "simulated-financial-provider",
            "amount": recorded_amount,
            "date": tx["date"],
            "reference": tx.get("reference", ""),
            "match": False,
            "note": "SYNTHETIC: Simulated record with differing amount",
        }

    # Digital channels with reference → full match
    if method in ("UPI", "BANK_TRANSFER", "BANK") and tx.get("reference"):
        return {
            "source": "simulated-financial-provider",
            "amount": amount,
            "date": tx["date"],
            "reference": tx["reference"],
            "match": True,
            "note": "SYNTHETIC: Simulated matching financial record",
        }

    # Has proof document → partial support
    if tx.get("proofFileName"):
        return {
            "source": "simulated-document-check",
            "amount": amount,
            "date": tx["date"],
            "reference": "",
            "match": True,
            "note": "SYNTHETIC: Supporting document available but not independently verified",
        }

    return None


def generate_worker_data() -> dict:
    """Generate a complete worker dataset for demonstration."""

    worker = {
        "id": "worker_arun_001",
        "full_name": "Arun Kumar",
        "occupation": "Vegetable Vendor",
        "city": "Pune, Maharashtra",
        "phone": "+91 98765 XXXXX",
        "member_since": "2026-06-01",
        "kyc_status": "PENDING",
        "data_source": "SYNTHETIC",
    }

    # Generate 90 days of financial activity
    base_date = datetime(2026, 8, 28)
    transactions = []

    random.seed(42)  # Reproducible synthetic data

    # --- Regular daily income (vegetable sales) ---
    for day_offset in range(90):
        dt = base_date - timedelta(days=day_offset)

        # Skip some days (weekly off, festivals)
        if dt.weekday() == 0 and random.random() < 0.7:
            continue
        if random.random() < 0.08:
            continue

        # Daily sales income — base around ₹900-₹1,400
        daily_income = round(random.gauss(1100, 150))
        daily_income = max(600, min(1800, daily_income))

        # Payment method distribution
        r = random.random()
        if r < 0.45:
            method = "UPI"
            ref = f"UPI/{random.randint(100000, 999999)}/GPay"
            proof = "upi_screenshot.png" if random.random() < 0.6 else ""
        elif r < 0.65:
            method = "CASH"
            ref = ""
            proof = ""
        elif r < 0.80:
            method = "BANK_TRANSFER"
            ref = f"NEFT/{random.randint(100000, 999999)}"
            proof = "bank_statement.pdf" if random.random() < 0.5 else ""
        else:
            method = "OTHER"
            ref = ""
            proof = "receipt_photo.jpg" if random.random() < 0.4 else ""

        tx = {
            "id": _id(),
            "title": f"Daily vegetable sales - {dt.strftime('%d %b')}",
            "type": "INCOME",
            "category": "Daily Sales",
            "amount": daily_income,
            "date": _date_str(dt),
            "counterparty": random.choice([
                "Market customers",
                "Walk-in buyers",
                "Regular customer",
                "Wholesale buyer",
                "Restaurant order",
            ]),
            "paymentMethod": method,
            "reference": ref,
            "referenceId": ref,
            "proofFileName": proof,
            "proofDocument": proof,
            "notes": "",
        }
        transactions.append(tx)

    # --- Weekly wholesale purchases (expenses) ---
    for week in range(13):
        dt = base_date - timedelta(days=week * 7 + random.randint(0, 2))
        expense = round(random.gauss(3500, 500))
        expense = max(2000, min(5500, expense))

        method = random.choice(["UPI", "CASH", "BANK_TRANSFER"])
        ref = f"UPI/{random.randint(100000, 999999)}/PhonePe" if method == "UPI" else ""
        proof = "wholesale_receipt.jpg" if random.random() < 0.5 else ""

        tx = {
            "id": _id(),
            "title": f"Wholesale vegetable purchase - Week {week + 1}",
            "type": "EXPENSE",
            "category": "Inventory & Supplies",
            "amount": expense,
            "date": _date_str(dt),
            "counterparty": random.choice([
                "APMC Market",
                "Wholesale supplier",
                "Farm direct purchase",
            ]),
            "paymentMethod": method,
            "reference": ref,
            "referenceId": ref,
            "proofFileName": proof,
            "proofDocument": proof,
            "notes": "",
        }
        transactions.append(tx)

    # --- Monthly rent ---
    for month in range(3):
        dt = base_date - timedelta(days=month * 30 + 1)
        tx = {
            "id": _id(),
            "title": f"Market stall rent - Month {month + 1}",
            "type": "EXPENSE",
            "category": "Rent & Facilities",
            "amount": 2500,
            "date": _date_str(dt),
            "counterparty": "Market committee",
            "paymentMethod": "CASH",
            "reference": "",
            "referenceId": "",
            "proofFileName": "rent_receipt.jpg" if month < 2 else "",
            "proofDocument": "rent_receipt.jpg" if month < 2 else "",
            "notes": "Monthly stall rental",
        }
        transactions.append(tx)

    # --- Monthly savings deposit ---
    for month in range(3):
        dt = base_date - timedelta(days=month * 30 + 5)
        savings = round(random.gauss(3000, 500))
        savings = max(1500, min(5000, savings))
        tx = {
            "id": _id(),
            "title": f"Savings deposit - Month {month + 1}",
            "type": "EXPENSE",
            "category": "Savings",
            "amount": savings,
            "date": _date_str(dt),
            "counterparty": "Post office savings",
            "paymentMethod": "BANK_TRANSFER",
            "reference": f"SAV/{random.randint(100000, 999999)}",
            "referenceId": f"SAV/{random.randint(100000, 999999)}",
            "proofFileName": "passbook_entry.jpg",
            "proofDocument": "passbook_entry.jpg",
            "notes": "Regular savings",
        }
        transactions.append(tx)

    # --- Loan repayment ---
    for month in range(3):
        dt = base_date - timedelta(days=month * 30 + 10)
        tx = {
            "id": _id(),
            "title": f"Microfinance repayment - Month {month + 1}",
            "type": "EXPENSE",
            "category": "Loan Repayment",
            "amount": 1500,
            "date": _date_str(dt),
            "counterparty": "Local MFI group",
            "paymentMethod": "UPI",
            "reference": f"UPI/{random.randint(100000, 999999)}/MFI",
            "referenceId": f"UPI/{random.randint(100000, 999999)}/MFI",
            "proofFileName": "mfi_receipt.pdf",
            "proofDocument": "mfi_receipt.pdf",
            "notes": "Weekly group meeting repayment",
        }
        transactions.append(tx)

    # --- Unusual transactions (for anomaly detection) ---
    # Large unusual income
    dt = base_date - timedelta(days=15)
    transactions.append({
        "id": _id(),
        "title": "Festival bulk order - Ganesh Chaturthi",
        "type": "INCOME",
        "category": "Special Order",
        "amount": 18000,
        "date": _date_str(dt),
        "counterparty": "Housing society bulk order",
        "paymentMethod": "UPI",
        "reference": f"UPI/{random.randint(100000, 999999)}/GPay",
        "referenceId": f"UPI/{random.randint(100000, 999999)}/GPay",
        "proofFileName": "bulk_order_screenshot.png",
        "proofDocument": "bulk_order_screenshot.png",
        "notes": "Large one-time festival order",
    })

    # Another unusual large cash receipt
    dt = base_date - timedelta(days=40)
    transactions.append({
        "id": _id(),
        "title": "Unexpected large cash income",
        "type": "INCOME",
        "category": "Cash Receipts",
        "amount": 22000,
        "date": _date_str(dt),
        "counterparty": "Unknown source",
        "paymentMethod": "CASH",
        "reference": "",
        "referenceId": "",
        "proofFileName": "",
        "proofDocument": "",
        "notes": "",
    })

    # Sort by date descending
    transactions.sort(key=lambda t: t["date"], reverse=True)

    return {
        "worker": worker,
        "transactions": transactions,
    }
