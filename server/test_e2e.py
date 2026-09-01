#!/usr/bin/env python3
"""
End-to-end test for FinProof backend.

Tests the complete analysis flow:
  Worker has financial activity
    → Evidence classification
    → Financial behaviour analysis
    → Anomaly detection
    → Digital Financial Profile
    → Lender-ready summary
"""

import json
import sys
import urllib.request
import urllib.error

BASE = "http://localhost:8000/api"
PASS = 0
FAIL = 0


def test(name, url, method="GET", data=None, checks=None):
    global PASS, FAIL
    try:
        if data:
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode(),
                headers={"Content-Type": "application/json"},
                method=method,
            )
        else:
            req = urllib.request.Request(url, method=method)

        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read())

        # Run checks
        if checks:
            for check_name, check_fn in checks.items():
                try:
                    assert check_fn(body), f"Check '{check_name}' failed"
                except AssertionError as e:
                    print(f"  ✗ {name} — {e}")
                    FAIL += 1
                    return body
                except Exception as e:
                    print(f"  ✗ {name} — Exception in check '{check_name}': {e}")
                    FAIL += 1
                    return body

        print(f"  ✓ {name}")
        PASS += 1
        return body

    except Exception as e:
        print(f"  ✗ {name} — {e}")
        FAIL += 1
        return None


print("=" * 60)
print("FinProof Backend — End-to-End Test")
print("=" * 60)

# 1. Health
print("\n[1] Health Check")
test("Health", f"{BASE}/health", checks={
    "status ok": lambda r: r["status"] == "ok",
    "data source": lambda r: r["dataSource"] == "SYNTHETIC",
})

# 2. Profile
print("\n[2] Worker Profile")
test("Profile", f"{BASE}/profile", checks={
    "has name": lambda r: "fullName" in r,
    "has occupation": lambda r: "occupation" in r,
    "synthetic": lambda r: r.get("dataSource") == "SYNTHETIC",
})

# 3. Financial Stats
print("\n[3] Financial Stats")
test("Stats", f"{BASE}/financial-stats", checks={
    "has income avg": lambda r: r["monthlyIncomeAvg"] > 0,
    "has expenses avg": lambda r: r["monthlyExpensesAvg"] > 0,
    "has net cashflow": lambda r: "netMonthlyCashflow" in r,
    "positive turnover": lambda r: r["totalRecordedTurnover"] > 0,
})

# 4. Transactions
print("\n[4] Transactions")
txs = test("List transactions", f"{BASE}/transactions", checks={
    "is list": lambda r: isinstance(r, list),
    "non-empty": lambda r: len(r) > 0,
    "has evidence": lambda r: all("evidenceStatus" in t for t in r),
    "has evidence explanation": lambda r: all("evidence" in t for t in r),
})

# Check evidence statuses are valid
if txs:
    statuses = set(t["evidenceStatus"] for t in txs)
    valid = {"VERIFIED", "CORROBORATED", "SELF_DECLARED", "MISMATCH"}
    print(f"  → Evidence statuses found: {statuses}")
    assert statuses.issubset(valid), f"Invalid statuses: {statuses - valid}"

# 5. Transaction Filters
print("\n[5] Transaction Filters")
test("Filter by INCOME", f"{BASE}/transactions?type=INCOME", checks={
    "all income": lambda r: all(t["type"] == "INCOME" for t in r),
})
test("Filter by EXPENSE", f"{BASE}/transactions?type=EXPENSE", checks={
    "all expense": lambda r: all(t["type"] == "EXPENSE" for t in r),
})
test("Filter SELF_DECLARED", f"{BASE}/transactions?evidenceStatus=SELF_DECLARED", checks={
    "all self-declared": lambda r: all(t["evidenceStatus"] == "SELF_DECLARED" for t in r),
})

# 6. Add Transaction
print("\n[6] Add Transaction")
new_tx = test("Add UPI income", f"{BASE}/transactions", method="POST",
    data={
        "title": "Test UPI Payment",
        "type": "INCOME",
        "category": "Client Services",
        "amount": 1500,
        "date": "2026-08-31",
        "counterparty": "Test Customer",
        "paymentMethod": "UPI",
        "reference": "UPI/999999/GPay",
        "proofFileName": "test_screenshot.png",
    },
    checks={
        "has id": lambda r: "id" in r,
        "correct amount": lambda r: r["amount"] == 1500,
        "has evidence": lambda r: r["evidenceStatus"] in ("VERIFIED", "CORROBORATED", "SELF_DECLARED", "MISMATCH"),
        "has explanation": lambda r: "evidence" in r and "explanation" in r["evidence"],
    },
)
if new_tx:
    print(f"  → Evidence status: {new_tx['evidenceStatus']}")
    print(f"  → Explanation: {new_tx['evidence']['explanation'][:80]}...")

# Add a cash transaction (should be SELF_DECLARED)
cash_tx = test("Add cash income (no proof)", f"{BASE}/transactions", method="POST",
    data={
        "title": "Cash sale at market",
        "type": "INCOME",
        "category": "Cash Receipts",
        "amount": 800,
        "date": "2026-08-30",
        "counterparty": "Walk-in customer",
        "paymentMethod": "CASH",
    },
    checks={
        "self-declared": lambda r: r["evidenceStatus"] == "SELF_DECLARED",
    },
)

# 7. Full Analysis
print("\n[7] Full Analysis (Behaviour + Anomalies)")
analysis = test("Analysis", f"{BASE}/analysis", checks={
    "has metrics": lambda r: "metrics" in r and len(r["metrics"]) > 0,
    "has anomalies": lambda r: "anomalies" in r,
})
if analysis:
    print(f"  → Metrics: {len(analysis['metrics'])}")
    for m in analysis["metrics"]:
        print(f"    • {m['title']}: {m['value']}")
    print(f"  → Anomalies: {len(analysis['anomalies'])}")

# 8. Evidence Breakdown
print("\n[8] Evidence Breakdown")
test("Evidence", f"{BASE}/analysis/evidence", checks={
    "has breakdown": lambda r: "breakdown" in r,
    "has coverage": lambda r: "coverage" in r,
    "has counts": lambda r: "status_counts" in r,
})

# 9. Behaviour Analysis
print("\n[9] Behaviour Analysis")
behaviour = test("Behaviour", f"{BASE}/analysis/behaviour", checks={
    "has metrics": lambda r: "metrics" in r and len(r["metrics"]) > 0,
    "has explanations": lambda r: all(
        "what" in m and "why" in m and "evidence" in m
        for m in r["metrics"]
    ),
})

# 10. Anomalies
print("\n[10] Anomaly Detection")
anom = test("Anomalies", f"{BASE}/analysis/anomalies", checks={
    "has anomalies": lambda r: "anomalies" in r,
    "has note": lambda r: "note" in r,
    "anomalies dont accuse fraud": lambda r: all(
        "fraud" not in a.get("what", "").lower()
        and "fake" not in a.get("what", "").lower()
        and "lying" not in a.get("what", "").lower()
        for a in r.get("anomalies", [])
    ),
})
if anom and anom["anomalies"]:
    for a in anom["anomalies"][:3]:
        print(f"    • [{a['severity']}] {a['title'][:60]}")
        print(f"      What: {a['what'][:80]}")

# 11. Financial Profile
print("\n[11] Digital Financial Profile")
profile = test("Profile", f"{BASE}/financial-profile", checks={
    "has worker info": lambda r: "worker_information" in r,
    "has observation": lambda r: "observation_period" in r,
    "has metrics": lambda r: "financial_metrics" in r,
    "has evidence": lambda r: "evidence_breakdown" in r,
    "has coverage": lambda r: "evidence_coverage" in r,
    "has anomalies": lambda r: "anomalies" in r,
    "has insights": lambda r: "insights" in r and len(r["insights"]) > 0,
    "has limitations": lambda r: "limitations" in r and len(r["limitations"]) > 0,
    "data source": lambda r: r.get("data_source") == "SYNTHETIC",
})
if profile:
    print(f"  → Worker: {profile['worker_information']['name']}")
    print(f"  → Period: {profile['observation_period']['description']}")
    print(f"  → Coverage: {profile['evidence_coverage']}%")
    print(f"  → Anomalies: {len(profile['anomalies'])}")
    print(f"  → Insights:")
    for insight in profile["insights"]:
        print(f"    • {insight[:80]}")

# 12. Lender Report
print("\n[12] Lender-Ready Report")
lender = test("Lender Report", f"{BASE}/lender-report", checks={
    "has report id": lambda r: "report_id" in r,
    "has worker info": lambda r: "worker_information" in r,
    "has behaviour": lambda r: "financial_behaviour" in r,
    "has evidence summary": lambda r: "evidence_summary" in r,
    "has interpretation": lambda r: "overall_interpretation" in r and len(r["overall_interpretation"]) > 0,
    "has limitations": lambda r: "limitations" in r,
    "data source": lambda r: r.get("data_source") == "SYNTHETIC",
    "no fraud language": lambda r: "fraud" not in r["overall_interpretation"].lower(),
})
if lender:
    print(f"  → Report ID: {lender['report_id']}")
    print(f"  → Interpretation: {lender['overall_interpretation'][:120]}...")

# 13. Monthly Cashflows
print("\n[13] Monthly Cashflows")
test("Cashflows", f"{BASE}/cashflows", checks={
    "is list": lambda r: isinstance(r, list),
    "has months": lambda r: len(r) > 0,
    "has fields": lambda r: all("income" in m and "expenses" in m and "net" in m for m in r),
})

# Summary
print("\n" + "=" * 60)
print(f"RESULTS: {PASS} passed, {FAIL} failed")
print("=" * 60)

if FAIL > 0:
    sys.exit(1)
