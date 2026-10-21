import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from watchdog_widget import ThreatScanner

test_titles = [
    # Auditor's 7 failing normal titles (MUST BE SAFE)
    ("KBC highlights today episode", "SAFE"),
    ("Electricity bill kaise kam kare 5 tips", "SAFE"),
    ("NEET paper leak latest news", "SAFE"),
    ("Digital arrest se kaise bache", "SAFE"),
    ("Crypto profit tax rules India", "SAFE"),
    ("Credit card limit increase kaise kare", "SAFE"),
    ("Police FIR kaise darj kare", "SAFE"),

    # Auditor's 4 missed scams (MUST BE HIGH)
    ("Telegram par daily task karo registration fee 500", "HIGH"),
    ("Sir main CBI se bol raha hu aapke parcel mein drugs mile hain", "HIGH"),
    ("Your SIM will be blocked today share OTP now", "HIGH"),
    ("Invest karo 40% return guaranteed", "HIGH"),

    # User's previous 6 normal test cases (MUST BE SAFE)
    ("Netflix new web series review", "SAFE"),
    ("Aadhaar card download kaise kare", "SAFE"),
    ("Amazon refund policy explained", "SAFE"),
    ("Profit margin kaise nikale", "SAFE"),
    ("Customs duty kitni lagti hai", "SAFE"),
    ("Scholarship ke liye apply kaise kare", "SAFE"),

    # Cloaked awareness scam (MUST BE HIGH)
    ("Awareness: Digital arrest CBI officer illegal parcel abhi paise bhejo", "HIGH"),

    # Realistic scams (MUST BE HIGH)
    ("How to double money in 7 days guaranteed", "HIGH"),
    ("25 lakh lottery winner claim your prize KBC", "HIGH"),
    ("Digital arrest CBI officer illegal parcel video call par rahiye", "HIGH"),
    ("Electricity bill update connection kat jayega aaj raat call karo", "HIGH")
]

passed = 0
for text, expected in test_titles:
    res = ThreatScanner.scan(text)
    lvl = res["level"]
    ok = (lvl == expected)
    if ok:
        passed += 1
    status = "OK" if ok else "FAIL"
    print(f"[{status:4}] Expected {expected:4} | Got {lvl:4} | Text: {text}")

print(f"\nResult: {passed}/{len(test_titles)} passed ({(passed/len(test_titles))*100:.1f}%)")
