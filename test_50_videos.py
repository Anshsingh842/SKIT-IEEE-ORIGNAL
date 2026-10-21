import os
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from watchdog_widget import ThreatScanner

TEST_CASES = [
    # --- 1. USER'S 6 SPECIFIC TEST CASES (MUST BE SAFE - ZERO FALSE ALARMS!) ---
    {"id": 1, "text": "Netflix new web series review - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 2, "text": "Aadhaar card download kaise kare - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 3, "text": "Amazon refund policy explained - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 4, "text": "Profit margin kaise nikale - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 5, "text": "Customs duty kitni lagti hai - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 6, "text": "Scholarship ke liye apply kaise kare - YouTube", "type": "safe", "expected": ["SAFE"]},

    # --- 2. AWARENESS CLOAKING TEST (SCAM MUST NOT BYPASS SCANNER!) ---
    {"id": 7, "text": "Awareness: Digital arrest CBI officer illegal parcel, abhi paise bhejo - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 8, "text": "Cyber awareness: Lottery 25 lakh claim karne ke liye turant link par fees pay karo - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},

    # --- 3. GENUINE EDUCATIONAL ADVISORIES (MUST BE SAFE) ---
    {"id": 9, "text": "RBI Kehta Hai: Bank kabhi bhi aapka OTP ya PIN nahi mangta savdhaan - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 10, "text": "Cyber crime awareness video: Never share your OTP with anyone - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 11, "text": "Cyber cell advisory: Fraud se kaise bachein awareness documentary - YouTube", "type": "safe", "expected": ["SAFE"]},

    # --- 4. REALISTIC SCAMS (MUST BE HIGH / MEDIUM THREAT) ---
    {"id": 12, "text": "How to double money in 7 days guaranteed - YouTube - Google Chrome", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 13, "text": "25 lakh lottery winner claim your prize KBC - YouTube - Google Chrome", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 14, "text": "Digital arrest CBI officer illegal parcel video call - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 15, "text": "Electricity bill update disconnect warning light cut tonight - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 16, "text": "Free laptop yojana 2026 submit aadhaar card link - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 17, "text": "Work from home daily 5000 rs earn on telegram - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 18, "text": "KYC update account blocked call bank manager immediately - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 19, "text": "Instant loan approval in 2 minutes no documents required - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 20, "text": "Free mobile recharge 399 jio free airtel link share - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 21, "text": "Part time job simple typing 500 per day daily payout whatsapp - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 22, "text": "Crypto coin 1000x profit next bitcoin buy now telegram - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 23, "text": "Black magic specialist vashikaran 24 ghante mein samadhan - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 24, "text": "Instagram blue tick free apply link verification login - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 25, "text": "AnyDesk app install customer care remote access refund - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 26, "text": "Police FIR registered cyber crime notice pay penalty - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 27, "text": "Customs parcel airport gold trapped payment clearance - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 28, "text": "Flipkart big billion day 99% off iphone 15 sale claim - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 29, "text": "Paper leak board exam 100% real question paper buy - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 30, "text": "Sextortion video call leak complaint pay to delete blackmail - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 31, "text": "VIP betting tips cricket match fixed 100% win join group - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 32, "text": "1000 rupay lagao 2000 wapas pao scheme double paisa - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 33, "text": "पैसा डबल कैसे करें 24 घंटे में गारंटी - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 34, "text": "बिजली का बिल तुरंत भरें नहीं तो आज रात कटेगी - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 35, "text": "लॉटरी जीत चुके हैं 25 लाख क्लेम फॉर्म भरें - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 36, "text": "डिजिटल अरेस्ट सीबीआई अधिकारी पुलिस केस - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 37, "text": "Stock market insider tips 500% intraday return guarantee - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 38, "text": "Army officer transfer car bike sell cheap OLX advance payment - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 39, "text": "Sim card 5G upgrade verification OTP verification band ho jayega - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 40, "text": "Credit card limit increase pre-approved call back link - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},
    {"id": 41, "text": "WhatsApp 6-digit verification code share urgently - YouTube", "type": "scam", "expected": ["HIGH", "MEDIUM"]},

    # --- 5. MORE NORMAL / SAFE VIDEOS (MUST BE SAFE) ---
    {"id": 42, "text": "Top 10 smartphone comparison 2026 - Tech Review - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 43, "text": "How to bake a chocolate cake at home - Cooking Tutorial - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 44, "text": "India vs Australia cricket highlights match final - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 45, "text": "Python programming tutorial for beginners full course - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 46, "text": "Best budget gaming laptop review under 50000 - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 47, "text": "How to learn English speaking fluently daily tips - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 48, "text": "Car review driving impression mileage and features - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 49, "text": "Meditation and relaxing sleep music 1 hour - YouTube", "type": "safe", "expected": ["SAFE"]},
    {"id": 50, "text": "Daily vlog day in my life college student - YouTube", "type": "safe", "expected": ["SAFE"]}
]

passed = 0
failed = []

print("=" * 70)
print("RUNNING FRAUDVEDA 50-VIDEO THREAT MONITORING SUITE")
print("=" * 70)

for test in TEST_CASES:
    res = ThreatScanner.scan(test["text"])
    level = res["level"]
    is_ok = level in test["expected"]

    if is_ok:
        passed += 1
        icon = "[OK]"
    else:
        icon = "[FAIL]"
        failed.append((test, res))

    print(f"{icon} #{test['id']:02d} [{level:^6}] Score: {res.get('score', 0):>3} | {test['type'].upper():<4} | Type: {res.get('scam_type', '')[:22]:<22} | Title: {test['text'][:42]}...")

print("=" * 70)
print(f"RESULTS: {passed}/{len(TEST_CASES)} PASSED ({(passed/len(TEST_CASES))*100:.1f}%)")
if failed:
    print(f"\nFAILED TESTS ({len(failed)}):")
    for t, r in failed:
        print(f"  - #{t['id']}: expected {t['expected']}, got {r['level']} (score {r.get('score')}) | Matched: {r.get('matched_keywords')} | Text: {t['text']}")
print("=" * 70)

if passed == len(TEST_CASES):
    print(">>> 100% PERFECT ACCURACY ACHIEVED! ZERO FALSE ALARMS & NO SCAM BYPASS! <<<")
else:
    sys.exit(1)
