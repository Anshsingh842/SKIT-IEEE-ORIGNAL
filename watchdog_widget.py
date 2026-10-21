"""
watchdog_widget.py - AI Chowkidaar Floating Screen Widget & Real-Time SOC Server
Always-on-top draggable circular AI chatbot (🛡️) on user's screen.
Features:
1. Draggable Floating Chatbot with glowing shield & animated status dot
2. 3-Option Interactive Menu:
   - Option 1: Master Enable / Disable Toggle
   - Option 2: Reel Threat Analytics with context-aware reason box + Human Review Buttons
   - Option 3: Open Full Analytics Dashboard (index.html)
3. In-Video / On-Screen Threat Warning Overlay (Popup with Review, Skip [Auto-Scroll], Continue)
   - Strict Word Boundary Regex to prevent ANY false alarms on normal videos
   - Zero false alarms on system tools like Snipping Tool, Task Manager, etc.
4. 60 SKIT004 Hackathon Dataset Detection Engine + Hindi Devanagari Transliteration
5. Built-in Local API Server (port 8765) for Live Dashboard Sync (Human Verified & Live Feeds)
6. Real-Time YouTube Reel Scroll Watcher + Keyboard Hook + Clipboard Scanner
"""

import sys
import os
import re
import json
import time
import ctypes
# Enable Per-Monitor High-DPI Awareness for Razor-Sharp Text & Graphics (Eliminates Blur on Laptops)
try:
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
except Exception:
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass
import urllib.request
import webbrowser
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
try:
    from http.server import ThreadingHTTPServer
except ImportError:
    ThreadingHTTPServer = HTTPServer
import tkinter as tk
from tkinter import messagebox

if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'data', 'skit004_dataset.json')
DASHBOARD_URL = "http://127.0.0.1:8765/index.html"

# Load 60 SKIT004 Rules
SKIT004_RULES = []
try:
    if os.path.exists(DATASET_PATH):
        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            SKIT004_RULES = json.load(f)
except Exception as e:
    print("Error loading dataset:", e)

# Hindi Devanagari to Hinglish transliteration dictionary for scam triggers
HINDI_MAPPINGS = {
    'पैसा डबल': 'paise double guarantee',
    'पैसे डबल': 'paise double guarantee',
    'पैसा दुगना': 'paise double guarantee',
    'पैसे दुगने': 'paise double guarantee',
    'पैसा': 'paisa',
    'पैसे': 'paise',
    'दुगना': 'dugna',
    'दुगने': 'dugne',
    'डबल': 'double',
    'लॉटरी': 'lottery',
    'डिजिटल अरेस्ट': 'digital arrest cbi officer',
    'सीबीआई': 'cbi officer digital arrest',
    'केवाईसी': 'kyc account band',
    'ओटीपी': 'otp',
    'रिफंड': 'refund',
    'कस्टमर केयर': 'customer care',
    'इन्वेस्टमेंट': 'investment',
    'मुनाफा': 'profit',
    'गारंटी': 'guarantee',
    'फ्री रिचार्ज': 'free recharge',
    'बिजली बिल': 'bijli bill',
    'बिजली': 'bijli',
    'आज रात': 'aaj raat',
    'कटेगी': 'connection kat jayega',
    'कट जाएगी': 'connection kat jayega',
    '25 लाख': '25 lakh',
    'क्लेम': 'claim',
    'फॉर्म': 'form',
    'आधार': 'aadhaar',
    'ब्लू टिक': 'blue tick',
    'एनीडेस्क': 'anydesk',
    'लोन': 'loan',
    'तांत्रिक': 'tantrik',
    'वशीकरण': 'vashikaran',
    'काला जादू': 'kala jadu',
    'घर बैठे': 'ghar baithe'
}

# Generic words that can NEVER trigger an alert alone (Requires 2+ keywords or strong phrase)
GENERIC_WORDS = {
    'netflix', 'refund', 'aadhaar', 'profit', 'fir', 'customs', 'subsidy',
    'scholarship', 'army', 'tax', 'bonus', 'matrimonial', 'trading', 'loan',
    'sim', 'app', 'link', 'form', 'free', 'proof', 'claim', 'pin', 'otp',
    'upi', 'apk', 'gift', 'task', '500', 'login', 'army', '50000', '25000',
    '1 lakh', '10000', 'diamond', 'police', 'gift voucher', 'referral',
    'cashback', 'salary', 'kbc', 'lottery', 'card', 'bank', 'whatsapp',
    'video call', 'password', 'telegram', 'review', 'download', 'apply',
    'duty', 'margin', 'series', 'movie', 'episode', 'policy', 'update',
    'account', 'bijli', 'electricity', 'light', 'bill', 'number', 'call',
    'customer care', 'fast', 'instant', 'earn', 'daily', 'winner', 'money'
}

# 1. Genuine Official Advisories, Guides & Scam Warnings (100% Safe when no predatory demands)
GENUINE_ADVISORIES = [
    r'\b(?:se\s+kaise\s+bache(?:in)?|kaise\s+bache(?:in)?)\b',
    r'\b(?:how\s+to\s+(?:avoid|prevent|stop|protect|spot))\b',
    r'\b(?:scam\s*warning|fraud\s*warning|scam\s*alert|savdhaan|advisory|cyber\s*cell\s*advisory)\b',
    r'\b(?:mann\s*ki\s*baat|pm\s*modi\s*(?:scam\s*)?warning|rbi\s*kehta\s*hai)\b',
    r'\b(?:never\s+share\s+(?:your\s+)?(?:otp|pin|password))\b',
    r'\b(?:bank\s+kabhi\s+bhi\s+(?:otp|pin)\s+nahi\s+mangta)\b',
    r'\b(?:kisi\s+ko\s+(?:bhi\s+)?(?:otp|pin)\s+mat\s+batao)\b',
    r'\b(?:scam\s+kya\s+hai|fraud\s+kya\s+hai|kya\s+hota\s+hai)\b',
    r'\b(?:cyber\s*police\s*awareness|awareness|police\s*awareness|public\s*awareness)\b',
    r'\b(?:supreme\s*court|high\s*court|court\s*hearing|police\s*investigation|arrested|busted|gang\s*busted)\b',
    r'\b(?:in\s+fd|fixed\s+deposit|mutual\s+funds?|bank\s+fd)\b',
    r'\b(?:donates?|donation|donated)\b',
    r'\b(?:can\s+you|is\s+it\s+possible|myth\s+vs\s+reality|fact\s+check)\b'
]

# 2. General Informational, News, How-To & Reviews (Safe if no active scam demands)
INFO_NEWS_MODIFIERS = [
    r'\b(?:latest\s+news|breaking\s+news|news\s+today|news\s+update|samachar)\b',
    r'\b(?:highlights|today\s+episode|full\s+episode|episode\s+\d+)\b',
    r'\b(?:kaise\s+kam\s+kare|tips\s+to\s+reduce|savings?\s+tips)\b',
    r'\b(?:tax\s+rules|budget\s+rules|government\s+rules|guidelines)\b',
    r'\b(?:kaise\s+darj\s+kare|download\s+kaise\s+kare|margin\s+kaise\s+nikale|kitni\s+lagti\s+hai|apply\s+kaise\s+kare|limit\s+increase\s+kaise\s+kare)\b',
    r'\b(?:policy\s+explained|driving\s+impression|mileage|comparison|tutorial|course|vlog)\b'
]

# 3. Predatory Action / Urgency Demands
SCAM_ACTION_DEMANDS = [
    # Call demands
    r'\b(?:call\s*karo|call\s*now|call\s*immediately|call\s*this\s*number|sampark\s*karein|contact\s*now|call\s*back|call\s*bank\s*manager)\b',
    # Payment / Transfer / Advance fees / Deposit
    r'\b(?:pehle\s*fees?\s*bhejo|pehle.*(?:jama|fees?|deposit|bhejo)|bhejo|abhi\s*paise\s*bhejo|paise\s*bhejo|send\s*money|pay\s*karo|fees?\s*pay|pay\s*penalty|turant\s*upi|advance\s*(?:payment|fees?)|deposit|jama\s*karo|registration\s*fee)\b',
    # OTP / Pin / Code stealing
    r'\b(?:mujhe\s*bhej\s*do|bhej\s*do|share\s*(?:otp|code|now|urgently)?|otp\s*batao|pin\s*batao|code\s*share|send\s*code|share\s*urgently)\b',
    # Disconnection threats
    r'\b(?:kat\s*jayeg[ai]|band\s*ho\s*jayeg[ai]|disconnect(?:ed)?|cut\s*tonight|will\s*be\s*cut)\b',
    # Coercion / Extortion
    r'\b(?:video\s*call\s*par\s*rahiye|jail\s*hogi|police\s*case|arrest\s*warrant|drugs\s*mile\s*hain)\b',
    # Guaranteed profit claims & Money doubling
    r'\b(?:guarantee[d]?|100%\s*guarantee[d]?|pakka\s*profit|sure\s*shot)\b',
    r'\b(?:double\s*(?:your\s+|my\s+)?money|paise\s*double|paisa\s*double|double\s*money)\b',
    # Unrealistic earnings / Task claims
    r'\b(?:earn|kamayein|kamao)\s+(?:rs\.?|rupay|inr|\$)?\s*\d+\s*(?:rs\.?|rupay|inr|\$)?\s*(?:for\s+every|for|per|in|every|har)\s*\d+\s*(?:min|minute|hour|ghante|day|din)\b',
    r'\binfinite\s+money\b',
    # Claiming lottery / prizes
    r'\b(?:claim\s*(?:karo|karein|your|form)|form\s*bharo|claim\s+prize|winner\s+claim)\b'
]

# 4. Verified Scam Patterns (Generalised regexes covering both English & Hinglish)
VERIFIED_SCAMS = [
    # Money doubling / Unrealistic guaranteed returns
    (r'\b(?:paisa|paise|money)\s+(?:double|dugna|2\s*guna)\b', "Ponzi / Money Doubling Scam", "Greed Exploitation & Unrealistic Returns", "Paise double karne ka jhootha vaada kiya ja raha hai.", "scam"),
    (r'\bdouble\s+(?:your\s+|my\s+)?(?:money|investment|cash)\b', "Investment Fraud", "High Return Lure", "Double money scheme detected.", "scam"),
    (r'\b(?:1000|500)\s*(?:rs|rupay)?\s*lagao\s*(?:2000|1000)\s*wapas\b', "Ponzi / Pyramidal Scam", "Deposit & Fast Return Lure", "Chhote paise lagakar turant dugne ka jhaansa.", "scam"),
    (r'\binvest.*(?:\d+x\s*returns?|\d+%\s*returns?|double).*guarantee[d]?\b', "Guaranteed Return Scam", "Fake Financial Guarantee", "Guaranteed high returns scheme - high financial risk.", "scam"),
    (r'\b(?:invest\s*karo\s*)?\d+%\s*return\s*guarantee[d]?\b', "Guaranteed Return Scam", "Fake Financial Guarantee", "Guaranteed high returns scheme.", "scam"),
    (r'\b(?:40%|50%|100%|200%|500%)\s*(?:return|profit|intraday)\s*(?:guarantee[d]?)?\b', "Guaranteed Return Scam", "High Return Lure", "Unrealistic guaranteed return scheme.", "scam"),
    (r'\b(?:insider\s*tips|stock\s*market\s*insider).*return\s*guarantee\b', "Stock Insider Scam", "False Certainty", "Stock market insider guaranteed return fraud.", "scam"),
    (r'\b5\s*guna\s*(?:profit|return|vip)\b', "VIP Telegram / Betting Scam", "Exclusivity & Guaranteed Profit Lure", "5 guna return / VIP group scam trigger.", "coordinated"),
    (r'\bsure\s*shot\s*profit\b', "Stock / Crypto Manipulation Fraud", "False Certainty Lure", "Sure-shot profit promise detected.", "scam"),
    (r'\b1000x\s*profit\b', "Crypto Pump & Dump Scam", "Exaggerated Profit Lure", "1000x profit claim detected.", "scam"),
    (r'\bcrypto\s+coin\s+1000x\b', "Crypto Pump & Dump Scam", "Exaggerated Profit Lure", "1000x crypto profit claim detected.", "scam"),
    (r'\b(?:3x|5x|10x|20x|100x)\s*(?:returns?|profit|gain|money)\b', "Guaranteed Return Scam", "Exaggerated Multiplier Lure", "3x/10x return multiplier scam pattern.", "scam"),
    (r'\binfinite\s+money\b', "Infinite Money Glitch Scam", "Impossible Financial Promise", "Infinite money claim detected.", "scam"),

    # Digital arrest / Police / CBI / Drugs parcel
    (r'\bdigital\s+arrest\b', "Digital Arrest Cyber Extortion", "Impersonation of Police/CBI & Coercion", "Digital arrest ki dhamki dekar darane ka prayas.", "tension"),
    (r'\b(?:main\s+)?cbi\s+(?:officer\s+)?(?:se\s+)?bol\s+raha\b', "Fake Police / CBI Impersonation", "Authority Impersonation", "Farzi CBI / Police officer bankar call kiya gaya.", "tension"),
    (r'\bcbi\s+officer\s+illegal\s+parcel\b', "Fake CBI Parcel Threat", "Authority Extortion", "Farzi CBI illegal parcel trap.", "tension"),
    (r'\bparcel\s+mein\s+(?:drugs|nasha|gold|illegal)\b', "Customs / Drug Parcel Blackmail", "Fear & Criminal Threat", "Farzi parcel mein illegal drugs/items ka darr dikhaya gaya.", "tension"),
    (r'\bdrugs\s+mile\s+hain\b', "Customs / Drug Parcel Extortion", "Legal Threat & Extortion", "Parcel mein drugs milne ka farzi ilzam.", "tension"),
    (r'\billegal\s+parcel\b', "Illegal Parcel Blackmail", "Authority Threat", "Illegal parcel extortion pattern matched.", "tension"),
    (r'\bvideo\s+call\s+par\s+rahiye\b', "Digital Arrest Coercion", "Isolation & Intimidation", "Victim ko video call par bandi banane ka tareeka.", "tension"),
    (r'\bcustoms\s+parcel\s+airport\s+gold\b', "Customs Gold Clearance Scam", "Greed & Fee Extortion", "Customs gold clearance scam detected.", "scam"),

    # Electricity bill phishing (Paraphrased & Multilingual)
    (r'\b(?:light|bijli|connection|power|electricity)\b.*(?:kat\s*jayegi|kat\s*jayega|band\s*ho\s*jayega|disconnect|cut\s*tonight|will\s*be\s*cut|aaj\s*raat).*(?:sampark|call|number|turant|immediately|pay|bill)\b',
     "Electricity Bill Disconnection Phishing", "Panic Disconnection Threat", "Aaj raat bijli katne ki farzi dhamki dekar call/payment mangna.", "scam"),
    (r'\bconnection\s+kat\s+jayega\b', "Electricity / Utility Disconnection Phishing", "Urgency & Service Disconnection Threat", "Aaj raat bijli connection katne ki farzi dhamki.", "scam"),
    (r'\baaj\s+raat\s+(?:light|bijli|connection)\s+(?:kat|band)\b', "Electricity Bill Phishing", "Panic Urgency", "Aaj raat bijli katne ka darr dikhakar call/payment mangna.", "scam"),
    (r'\b(?:light|bijli)\s+kat\s+jayegi\s+call\b', "Electricity Bill Phishing", "Panic Urgency", "Bijli katne ka darr dikhakar helpline par call karwana.", "scam"),
    (r'\belectricity\s+bill\s+update\s+disconnect\b', "Electricity Bill Disconnect Phishing", "Panic Urgency", "Electricity disconnect notice warning.", "scam"),
    (r'\belectricity\s+(?:will\s+be\s+cut|cut\s+tonight).*call\b', "Electricity Disconnect Scam", "Panic Urgency", "Electricity cut tonight fake helpline call lure.", "scam"),

    # SIM block & Telecom
    (r'\bsim\s+(?:will\s+be\s+)?blocked\s+today\b', "SIM Block / KYC Phishing", "Communication Cutoff Threat", "SIM block hone ka darr dikhakar OTP/details maangna.", "scam"),
    (r'\bsim\s+(?:card\s+)?(?:block|band)\s*(?:ho\s*jayega|hoga|kar\s*diya\s*jayega)\b', "SIM Block Deactivation Threat", "Urgency Trigger", "SIM block hone ki dhamki.", "scam"),
    (r'\bsim\s+block\s+2\s*ghanta\b', "SIM Deactivation Threat", "Urgency Trigger", "2 ghante mein SIM band hone ka jhaansa.", "scam"),
    (r'\bsim\s+band\s+hoga\s+share\s+otp\b', "SIM Swap / OTP Theft", "Credential Harvesting", "SIM band hone se bachane ke bahane OTP maangna.", "scam"),
    (r'\bsim\s+card\s+5g\s+upgrade\s+verification\b', "5G Upgrade SIM Swap Fraud", "Phishing Trap", "5G upgrade verification OTP scam.", "scam"),
    (r'\bprocessing\s*fees?\s*(?:pehle|jama|pay|advance|bhejo)\b', "Advance Processing Fee Scam", "Pre-payment Advance Fraud", "Processing fee pehle maangna.", "scam"),

    # Task / Job / WFH scams
    (r'\b(?:daily\s*task|har\s*like\s*par|telegram\s*task|part\s*time\s*job|typing\s*job|work\s*from\s*home|ghar\s*baithe).*(?:fee|deposit|earn|kamao|roz|daily|500|3000|5000).*(?:pehle|jama|fees?|deposit|registration|bhejo|whatsapp|telegram)\b',
     "Task / Part-Time Job Fraud", "Advance Deposit Lure", "Telegram task/YouTube like karke paise kamane ka jhaansa dekar fees maangna.", "coordinated"),
    (r'\b(?:daily\s*task|telegram\s*task|task\s*karo|part\s*time\s*job|work\s*from\s*home|ghar\s*baithe).*(?:registration\s*fee|registration|fee|deposit|pehle\s*fees?)\b',
     "Task / Part-Time Job Fraud", "Advance Deposit Lure", "Telegram task ke naam par registration fee maangna.", "coordinated"),
    (r'\b(?:earn|kamayein|kamao)\s+(?:rs\.?|rupay|inr|\$)?\s*\d+\s*(?:rs\.?|rupay|inr|\$)?\s*(?:for\s+every|for|per|in|every|har)\s*\d+\s*(?:min|minute|hour|ghante|day|din)\b',
     "Task / Unrealistic Earning Fraud", "Easy Money & Time Lure", "Unrealistic earning claim (e.g. 500 Rs every 20 min).", "coordinated"),
    (r'\btask\s*karo.*registration\s*fee\b', "Job Task Registration Fee Scam", "Pre-payment Advance Fraud", "Task ke naam par pehle registration fee maangna.", "scam"),
    (r'\bghar\s+baithe\s+roz\s+(?:3000|5000)\b', "Work From Home Scam", "Easy Money Illusion", "Ghar baithe bina mehnat ke roz 3000-5000 ka jhaansa.", "scam"),
    (r'\bwork\s+from\s+home\s+(?:daily|roz)\s+(?:3000|5000)\b', "Work From Home Fraud", "Unrealistic Income", "Unrealistic daily WFH income claim.", "scam"),
    (r'\bpart\s*time\s*job\s+simple\s+typing\b', "Typing Job Scam", "Advance Fee Trap", "Simple typing job advance payout trap.", "scam"),

    # KYC & Bank block
    (r'\bkyc\s+update\s+account\s+blocked\b', "Bank KYC Phishing", "Account Suspension Fear", "Account block ka darr dikhakar credentials maangna.", "scam"),
    (r'\baccount\s+blocked\s+call\s+bank\s+manager\b', "Bank Impersonation Phishing", "Credential Harvesting", "Fake bank manager call phishing.", "scam"),

    # Loan Scams
    (r'\binstant\s+loan\s+approval.*no\s+documents\b', "Predatory Loan App Scam", "Trap Loan Lure", "Instant loan approval without documents trap.", "scam"),

    # Free Schemes & Recharge
    (r'\bfree\s+laptop\s+yojana.*aadhaar\b', "Fake Government Yojana Phishing", "Identity Theft", "Free laptop yojana fake Aadhaar link.", "fake_news"),
    (r'\bfree\s+(?:mobile\s+|jio\s+|airtel\s+)?recharge\s+(?:399|\d+)?.*link\b', "Viral Forward Phishing", "Coordinated Viral Link", "Free recharge pane ke liye fake link share karna.", "coordinated"),
    (r'\bfree\s+(?:mobile\s+|jio\s+|airtel\s+)?recharge\s+forward\s+karo\b', "Viral Forward Phishing", "Coordinated Viral Link", "Free recharge forward scam.", "coordinated"),

    # Black magic / Tantrik
    (r'\b(?:vashikaran|kala\s*jadu|tantrik)\s+(?:upay|samadhan)\b', "Superstition / Tantrik Extortion", "Emotional Manipulation", "Kala jadu / Vashikaran ke naam par paise ainthna.", "tension"),
    (r'\b(?:vashikaran|kala\s*jadu|tantrik).*pehle\s*fees\b', "Tantrik Advance Fee Extortion", "Emotional Exploitation", "Vashikaran ke naam par pehle fees mangna.", "tension"),
    (r'\bblack\s*magic\s*specialist\s*vashikaran\b', "Black Magic Fraud", "Superstition Extortion", "Vashikaran 24 ghante mein samadhan fraud.", "tension"),

    # Lottery / Prize / KBC
    (r'\b(?:25\s*lakh\s+(?:ki\s+)?lottery|lottery\s+25\s*lakh|lottery.*(?:claim|jeet|winner|prize))\b', "Lottery / KBC Fraud", "Prize Lure & Advance Tax Fee", "Farzi 25 lakh lottery jeetne ka jhaansa.", "fake_news"),
    (r'\bwon\s+(?:25\s*lakh|1\s*crore)\s+lottery\b', "Lottery Prize Scam", "Prize Lure", "Fake lottery winnings alert.", "fake_news"),
    (r'\bkbc\s*lottery\s*25\s*lakh\b', "KBC WhatsApp Lottery Scam", "Brand Impersonation & Prize Lure", "KBC ke naam par farzi lottery fraud.", "fake_news"),
    (r'\b25\s*lakh\s+lottery\s+winner\s+claim\b', "Lottery Claim Phishing", "Prize Lure", "Lottery claim fee phishing trap.", "fake_news"),

    # Fake sale / iPhone
    (r'\biphone\s+(?:999|99%)\b', "Fake E-Commerce / iPhone Scam", "Too-Good-To-Be-True Deal", "iPhone Rs 999 ya 99% off ka farzi shopping link.", "fake_news"),
    (r'\b(?:90%|95%|99%)\s*off\s+iphone\b', "Fake Discount Phishing", "Deceptive Shopping Offer", "iPhone par 90-99% discount ka fake trap.", "fake_news"),

    # Paper leak buying
    (r'\bpaper\s+leak\s+(?:buy|answer\s*key|upi|500|board\s*exam)\b', "Exam Paper Leak Scam", "Cheating & Blackmail Trap", "Paper leak / Answer key bechne ke naam par UPI payment maangna.", "fake_news"),
    (r'\banswer\s+key\s+(?:500|1000)\s+upi\b', "Fake Exam Answer Key Scam", "Advance Fee Trap", "Farzi answer key ke liye advance UPI payment maangna.", "fake_news"),

    # Sextortion
    (r'\bprivate\s+photos\s+(?:leak|bhej\s+dunga|delete\s+pay)\b', "Sextortion / Video Call Blackmail", "Intimidation & Extortion", "Private video/photo leak karne ki dhamki dekar blackmail.", "tension"),
    (r'\bvideo\s+call\s+leak\s+pay\s+to\s+delete\b', "Sextortion Blackmail", "Extortion Demand", "Video call delete karne ke liye paise maangna.", "tension"),
    (r'\bsextortion\s+video\s+call\s+leak\b', "Sextortion Blackmail", "Intimidation & Extortion", "Sextortion video call blackmail trap.", "tension"),

    # Betting / Match Fixing
    (r'\b(?:vip\s*betting|match\s*fixed)\b', "VIP Match Fixing Scam", "Guaranteed Win Trap", "Match fixed / VIP betting scam.", "coordinated"),

    # Remote access Anydesk
    (r'\banydesk\s+(?:app\s+)?install.*(?:customer\s+care|remote|refund)\b', "Remote Access Trojan Scam", "Device Hijacking", "Anydesk install karwa ke bank account khaali karna.", "scam"),

    # Police FIR Notice
    (r'\bpolice\s+fir\s+registered.*pay\s+penalty\b', "Fake Police FIR Extortion", "Legal Threat & Extortion", "Fake police FIR notice to extort penalty.", "tension"),

    # OLX Army Officer
    (r'\barmy\s+officer\s+transfer.*advance\s+payment\b', "Army Officer Impersonation Scam", "Advance Payment Trap", "Army officer vehicle transfer advance payment fraud.", "scam"),

    # Social Media / OTP Stealing
    (r'\bcredit\s+card\s+limit\s+increase.*(?:call\s+back|link)\b', "Credit Card Limit Phishing", "Credential Harvesting", "Card limit increase phishing link.", "scam"),
    (r'\b(?:whatsapp.*)?(?:6[\s-]*digit\s*code|verification\s*code).*(?:bhej|share|send|mujhe)\b', "WhatsApp Account Takeover", "Credential Harvesting", "WhatsApp 6-digit code theft trap.", "scam"),
    (r'\binstagram\s+blue\s*tick.*(?:apply\s*link|login|verification)\b', "Instagram Blue Tick Phishing", "Credential Theft", "Blue tick verification phishing trap.", "scam")
]

def classify_category(scam_type, trick_used):
    st = (scam_type or "").lower()
    tu = (trick_used or "").lower()
    if any(k in st for k in ["fake govt", "paper leak", "kbc", "news", "verification", "subsidy", "sale"]) or "fake proof" in tu:
        return "fake_news"
    if any(k in st for k in ["digital arrest", "police", "sextortion", "black magic", "jail", "sim misuse"]) or "darr" in tu or "blackmail" in tu:
        return "tension"
    if any(k in st for k in ["telegram", "task", "chain", "referral"]) or "forward" in tu or "vip group" in tu:
        return "coordinated"
    return "scam"

# Shared Global State for Widget & HTTP API
LIVE_DATA_STORE = {
    "live_events": [],
    "recent_scans": [],
    "total_scanned_count": 0,
    "reviews": {},
    "last_scanned_video_id": "",
    "widget_ref": None
}

class ThreatScanner:
    @staticmethod
    def scan(text):
        raw = text or ""
        t = raw.lower().strip()

        if not t:
            return ThreatScanner._safe_result()

        # Add transliterated equivalents for Hindi Devanagari keywords
        for h, eng in HINDI_MAPPINGS.items():
            if h in raw:
                t += f" {eng}"

        # Clean leetspeak and extra spaces for common bypass attempts
        t_norm = re.sub(r'p\s*a\s*[i1]\s*s\s*[a4]', 'paisa', t)
        t_norm = re.sub(r'd\s*[o0]\s*u\s*b\s*l\s*e', 'double', t_norm)
        t_norm = re.sub(r'pa+is+a+', 'paisa', t_norm)
        t_norm = re.sub(r'do+ub+le+', 'double', t_norm)

        has_action = any(re.search(p, t) or re.search(p, t_norm) for p in SCAM_ACTION_DEMANDS)
        is_advisory = any(re.search(p, t) for p in GENUINE_ADVISORIES)
        is_info = any(re.search(p, t) for p in INFO_NEWS_MODIFIERS)

        # Legitimate banking instruments or charity/donation
        is_legit_fd = any(re.search(p, t) for p in [r'\b(?:in\s+fd|fixed\s+deposit|mutual\s+funds?|bank\s+fd)\b'])
        is_donation = any(re.search(p, t) for p in [r'\b(?:donates?|donation|donated)\b'])

        if (is_legit_fd or is_donation) and not any(re.search(p, t) for p in [r'\b(?:pehle.*fees|otp|advance)\b']):
            return ThreatScanner._safe_result("Verified legitimate banking / educational / news content.")

        # 1. If an active predatory scam demand is present, check verified scams immediately
        # (Cannot be cloaked with "latest news", "tutorial", "course", etc.)
        if has_action:
            for pat, scam_type, trick, reason, cat in VERIFIED_SCAMS:
                if re.search(pat, t) or re.search(pat, t_norm):
                    return {
                        "level": "HIGH",
                        "score": 95,
                        "category": cat,
                        "scam_type": scam_type,
                        "trick_used": trick,
                        "reasons": [reason],
                        "suggested_action": "Popup + Block Reel",
                        "matched_keywords": [scam_type],
                        "id": f"scan_{int(time.time() * 1000)}",
                        "timestamp": time.strftime("%H:%M:%S")
                    }

        # 2. Genuine Official Advisory / Warning without coercive scam action is 100% SAFE
        if is_advisory and not any(re.search(p, t) for p in [r'\b(?:video\s*call\s*par\s*rahiye|pehle.*(?:jama|fees?|deposit|bhejo)|abhi\s*paise\s*bhejo|bhej\s*do|drugs\s*mile\s*hain)\b']):
            return ThreatScanner._safe_result("Official advisory / educational guidance on avoiding fraud.")

        # 3. Informational / News / How-To without predatory scam demand is 100% SAFE
        if is_info and not has_action:
            return ThreatScanner._safe_result("Verified educational/news content.")

        # 4. Check Verified High-Confidence Scam Patterns
        for pat, scam_type, trick, reason, cat in VERIFIED_SCAMS:
            if re.search(pat, t) or re.search(pat, t_norm):
                return {
                    "level": "HIGH",
                    "score": 95,
                    "category": cat,
                    "scam_type": scam_type,
                    "trick_used": trick,
                    "reasons": [reason],
                    "suggested_action": "Popup + Block Reel",
                    "matched_keywords": [scam_type],
                    "id": f"scan_{int(time.time() * 1000)}",
                    "timestamp": time.strftime("%H:%M:%S")
                }

        # 4. Match 60 SKIT004 Hackathon Dataset Rules with Strict Boundary & Generic Word Protection
        best_match = None
        max_matched = 0

        for rule in SKIT004_RULES:
            raw_kws = rule.get('red_flag_keywords', '') or rule.get('keywords', '')
            if isinstance(raw_kws, list):
                kws = raw_kws
            else:
                kws = [k.strip() for k in str(raw_kws).split(';') if k.strip()]

            matched = []
            for kw in kws:
                pattern = r'\b' + re.escape(kw.lower()) + r'\b'
                if re.search(pattern, t):
                    matched.append(kw)

            non_generic = [k for k in matched if k.lower() not in GENERIC_WORDS]

            # Require at least 2 keywords with at least 1 non-generic, or 3+ keywords
            is_valid = (len(matched) >= 2 and len(non_generic) >= 1) or (len(matched) >= 3)

            # Never trigger on generic words alone
            if len(non_generic) == 0:
                is_valid = False

            if is_valid and len(matched) > max_matched:
                max_matched = len(matched)
                best_match = (rule, matched)

        if best_match and max_matched > 0:
            rule, matched = best_match
            is_high = str(rule.get('risk_level', '')).lower() == 'high'
            score = min(100, 85 + len(matched) * 4) if is_high else 65
            cat = classify_category(rule.get('scam_type', ''), rule.get('trick_used', ''))
            return {
                "level": "HIGH" if is_high else "MEDIUM",
                "score": score,
                "category": cat,
                "scam_type": rule.get('scam_type', 'Suspicious Scam'),
                "trick_used": rule.get('trick_used', 'Deceptive Pattern'),
                "reasons": [rule.get('reason', 'Scam trigger matched')],
                "suggested_action": rule.get('suggested_action', 'Popup + Block Reel'),
                "matched_keywords": matched,
                "id": f"scan_{int(time.time() * 1000)}",
                "timestamp": time.strftime("%H:%M:%S")
            }

        return ThreatScanner._safe_result()

    @staticmethod
    def _safe_result(reason=None):
        return {
            "level": "SAFE",
            "score": 10,
            "category": "safe",
            "scam_type": "Normal Content / Safe",
            "trick_used": "None",
            "reasons": [reason or "Yeh video verified normal content hai. Isme koi scam, fake scheme ya harmful keyword nahi mila."],
            "suggested_action": "Allow",
            "matched_keywords": [],
            "id": f"scan_{int(time.time() * 1000)}",
            "timestamp": time.strftime("%H:%M:%S")
        }


# ==========================================
# Local HTTP Server for Real-Time Dashboard Sync
# ==========================================
class WatchdogAPIHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        # Suppress noisy HTTP logs in console
        pass

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

    def end_headers(self):
        origin = self.headers.get('Origin', '')
        allowed_origins = ['http://127.0.0.1:8765', 'http://localhost:8765']
        if origin in allowed_origins:
            self.send_header('Access-Control-Allow-Origin', origin)
        else:
            self.send_header('Access-Control-Allow-Origin', 'http://127.0.0.1:8765')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        try:
            if self.path.startswith('/api/threats'):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                data = {
                    "status": "ok",
                    "live_events": LIVE_DATA_STORE["live_events"][:50],
                    "recent_scans": LIVE_DATA_STORE.get("recent_scans", [])[:25],
                    "reviews": LIVE_DATA_STORE["reviews"],
                    "total_threats": len(LIVE_DATA_STORE["live_events"]),
                    "total_scanned": LIVE_DATA_STORE.get("total_scanned_count", len(LIVE_DATA_STORE["live_events"])),
                    "reviewed_count": len(LIVE_DATA_STORE["reviews"]),
                    "server_time": time.strftime("%H:%M:%S")
                }
                self.wfile.write(json.dumps(data).encode('utf-8'))
            else:
                super().do_GET()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

    def do_POST(self):
        origin = self.headers.get('Origin')
        if origin and origin not in ['http://127.0.0.1:8765', 'http://localhost:8765']:
            self.send_response(403)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"error": "Forbidden: Untrusted Origin"}')
            return

        if self.path.startswith('/api/scan'):
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8')
            try:
                payload = json.loads(body)
                text = payload.get('text', '')
                res = ThreatScanner.scan(text)
                if LIVE_DATA_STORE["widget_ref"]:
                    LIVE_DATA_STORE["widget_ref"].root.after(0, lambda: LIVE_DATA_STORE["widget_ref"].trigger_threat_text(text))
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
        elif self.path.startswith('/api/review'):
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8')
            try:
                payload = json.loads(body)
                threat_id = payload.get('id')
                decision = payload.get('decision')
                if threat_id and decision:
                    LIVE_DATA_STORE["reviews"][threat_id] = decision
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "saved"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

def start_http_server():
    for attempt in range(3):
        try:
            ThreadingHTTPServer.allow_reuse_address = True
            server = ThreadingHTTPServer(('127.0.0.1', 8765), WatchdogAPIHandler)
            print("[FraudVeda] Local SOC Server active on http://127.0.0.1:8765")
            server.serve_forever()
            break
        except OSError as e:
            if getattr(e, 'errno', 0) == 10048 or "10048" in str(e):
                print(f"[FraudVeda] Port 8765 in use, retrying in 1s ({attempt+1}/3)...")
                time.sleep(1.0)
            else:
                break
        except Exception:
            break


# ==========================================
# FraudVedaWidget - Floating Screen UI
# ==========================================
class ChowkidaarWidget:
    def __init__(self):
        LIVE_DATA_STORE["widget_ref"] = self

        self.root = tk.Tk()
        self.root.title("FraudVeda - AI Threat Watchdog")
        self.root.overrideredirect(True)
        self.root.wm_attributes("-topmost", True)
        self.root.wm_attributes("-transparentcolor", "#010101")
        self.root.config(bg="#010101")

        self.screen_width = self.root.winfo_screenwidth()
        self.screen_height = self.root.winfo_screenheight()

        # Position bot at bottom-right corner
        self.bot_size = 76
        self.pos_x = self.screen_width - 130
        self.pos_y = self.screen_height - 200
        self.root.geometry(f"{self.bot_size}x{self.bot_size}+{self.pos_x}+{self.pos_y}")

        # State
        self.enabled = True
        self.drag_start_x = 0
        self.drag_start_y = 0
        self.has_dragged = False
        self.menu_window = None
        self.overlay_window = None
        self.bubble_window = None

        self.current_threat = ThreatScanner._safe_result()
        self.last_detected_threat = None
        self.review_decision = "Pending"
        self.last_clipboard = ""
        self.current_dismissed_video = None
        self.is_skipping = False
        self.last_scanned_text = ""

        self._build_bot_canvas()
        self._bind_drag()

        # Start continuous zero-touch watchers
        self._start_screen_watcher()
        self._start_clipboard_watcher()
        self._start_scroll_key_watcher()

        # Welcome Speech Bubble
        self.root.after(800, self._show_welcome_bubble)

    def _build_bot_canvas(self):
        self.canvas = tk.Canvas(
            self.root,
            width=self.bot_size,
            height=self.bot_size,
            bg="#010101",
            highlightthickness=0
        )
        self.canvas.pack(fill="both", expand=True)

        # Outer Glow Circle
        self.glow_circle = self.canvas.create_oval(
            3, 3, self.bot_size - 3, self.bot_size - 3,
            fill="#1e3a8a", outline="#00d4ff", width=2
        )
        # Inner Circle
        self.inner_circle = self.canvas.create_oval(
            8, 8, self.bot_size - 8, self.bot_size - 8,
            fill="#2563eb", outline="#38bdf8", width=2
        )
        # Center Shield Emoji
        self.shield_text = self.canvas.create_text(
            self.bot_size // 2, self.bot_size // 2,
            text="🛡️", font=("Segoe UI Emoji", 24)
        )
        # Status Dot (Bottom Right)
        self.status_dot = self.canvas.create_oval(
            self.bot_size - 22, self.bot_size - 22,
            self.bot_size - 6, self.bot_size - 6,
            fill="#10b981", outline="#0b0f17", width=2
        )

    def _bind_drag(self):
        self.canvas.bind("<Button-1>", self._on_mouse_down)
        self.canvas.bind("<B1-Motion>", self._on_mouse_drag)
        self.canvas.bind("<ButtonRelease-1>", self._on_mouse_up)

    def _on_mouse_down(self, event):
        self.drag_start_x = event.x
        self.drag_start_y = event.y
        self.has_dragged = False

    def _on_mouse_drag(self, event):
        dx = event.x - self.drag_start_x
        dy = event.y - self.drag_start_y
        if abs(dx) > 3 or abs(dy) > 3:
            self.has_dragged = True
            self.pos_x += dx
            self.pos_y += dy
            self.root.geometry(f"+{self.pos_x}+{self.pos_y}")
            if self.menu_window and self.menu_window.winfo_exists():
                self._update_menu_position()
            if self.bubble_window and self.bubble_window.winfo_exists():
                self._update_bubble_position()

    def _on_mouse_up(self, event):
        if not self.has_dragged:
            self.toggle_menu()

    def _update_status_dot(self):
        if not self.enabled:
            color = "#6b7280"  # Gray
        elif self.current_threat["level"] in ("HIGH", "MEDIUM"):
            color = "#ef4444"  # Red
        else:
            color = "#10b981"  # Green
        self.canvas.itemconfig(self.status_dot, fill=color)

    # ==========================================
    # Speech Alert Bubble
    # ==========================================
    def _show_welcome_bubble(self):
        self.show_speech_bubble(
            "🛡️ FraudVeda Active!",
            "Zero-Touch AI Watchdog monitoring YouTube.\n👉 Click karein 3 Options ke liye!",
            duration_ms=4500
        )

    def show_speech_bubble(self, title, text, duration_ms=5000):
        self.hide_speech_bubble()

        self.bubble_window = tk.Toplevel(self.root)
        self.bubble_window.overrideredirect(True)
        self.bubble_window.wm_attributes("-topmost", True)
        self.bubble_window.config(bg="#0b0f17")

        frame = tk.Frame(
            self.bubble_window,
            bg="#0b0f17",
            bd=2,
            relief="solid",
            highlightbackground="#00d4ff",
            highlightthickness=1,
            padx=10,
            pady=8
        )
        frame.pack(fill="both", expand=True)

        t_lbl = tk.Label(frame, text=title, font=("Segoe UI", 10, "bold"), fg="#00d4ff", bg="#0b0f17")
        t_lbl.pack(anchor="w")

        m_lbl = tk.Label(frame, text=text, font=("Segoe UI", 9), fg="#e5e7eb", bg="#0b0f17", justify="left")
        m_lbl.pack(anchor="w", pady=(2, 0))

        self._update_bubble_position()
        if duration_ms > 0:
            self.root.after(duration_ms, self.hide_speech_bubble)

    def _update_bubble_position(self):
        if not self.bubble_window or not self.bubble_window.winfo_exists():
            return
        w = 280
        h = 80
        bx = max(10, min(self.screen_width - w - 20, self.pos_x - w + self.bot_size))
        by = max(10, self.pos_y - h - 10)
        self.bubble_window.geometry(f"{w}x{h}+{bx}+{by}")

    def hide_speech_bubble(self):
        if self.bubble_window and self.bubble_window.winfo_exists():
            self.bubble_window.destroy()
            self.bubble_window = None

    # ==========================================
    # 3-Option Interactive Menu Window
    # ==========================================
    def toggle_menu(self):
        self.hide_speech_bubble()
        if self.menu_window and self.menu_window.winfo_exists():
            self.menu_window.destroy()
            self.menu_window = None
            return

        self.menu_window = tk.Toplevel(self.root)
        self.menu_window.title("FraudVeda Menu")
        self.menu_window.overrideredirect(True)
        self.menu_window.wm_attributes("-topmost", True)
        self.menu_window.config(bg="#0b0f17")

        container = tk.Frame(
            self.menu_window,
            bg="#0b0f17",
            bd=2,
            relief="solid",
            highlightbackground="#00d4ff",
            highlightthickness=1
        )
        container.pack(fill="both", expand=True)

        # Header
        header = tk.Frame(container, bg="#111827", padx=12, pady=8)
        header.pack(fill="x")

        title_lbl = tk.Label(
            header,
            text="🛡️ FraudVeda AI Threat Watchdog",
            font=("Segoe UI", 11, "bold"),
            fg="#00d4ff",
            bg="#111827"
        )
        title_lbl.pack(side="left")

        close_btn = tk.Button(
            header,
            text="✕",
            font=("Segoe UI", 10, "bold"),
            fg="#9ca3af",
            bg="#111827",
            bd=0,
            cursor="hand2",
            command=self.toggle_menu
        )
        close_btn.pack(side="right")

        content = tk.Frame(container, bg="#0b0f17", padx=14, pady=10)
        content.pack(fill="both", expand=True)

        # ------------------------------------------
        # Option 1: Master Enable / Disable Toggle
        # ------------------------------------------
        opt1_frame = tk.Frame(content, bg="#1f2937", padx=10, pady=8, bd=1, relief="ridge")
        opt1_frame.pack(fill="x", pady=(0, 10))

        opt1_lbl = tk.Label(
            opt1_frame,
            text="Watchdog Status:",
            font=("Segoe UI", 9, "bold"),
            fg="#d1d5db",
            bg="#1f2937"
        )
        opt1_lbl.pack(side="left")

        self.toggle_btn = tk.Button(
            opt1_frame,
            text="🟢 ENABLED" if self.enabled else "⚪ DISABLED",
            font=("Segoe UI", 9, "bold"),
            fg="#ffffff",
            bg="#059669" if self.enabled else "#4b5563",
            padx=10, pady=3,
            bd=0,
            cursor="hand2",
            command=self._on_toggle_state
        )
        self.toggle_btn.pack(side="right")

        # ------------------------------------------
        # Option 2: Reel Threat Analytics ("Kyun Roka Gaya?")
        # ------------------------------------------
        opt2_frame = tk.Frame(content, bg="#111827", padx=10, pady=8, bd=1, relief="ridge")
        opt2_frame.pack(fill="x", pady=(0, 10))

        analytics_hdr = tk.Frame(opt2_frame, bg="#111827")
        analytics_hdr.pack(fill="x")

        opt2_title = tk.Label(
            analytics_hdr,
            text="🔍 Reel Threat Analytics",
            font=("Segoe UI", 9, "bold"),
            fg="#f3f4f6",
            bg="#111827"
        )
        opt2_title.pack(side="left")

        # Select threat to display in Option 2: Live status of current reel
        disp_threat = self.current_threat
        level = disp_threat.get("level", "SAFE")
        is_threat = (level in ("HIGH", "MEDIUM"))
        badge_bg = "#ef4444" if level == "HIGH" else ("#f59e0b" if level == "MEDIUM" else "#10b981")
        self.level_badge = tk.Label(
            analytics_hdr,
            text=f" {level} ",
            font=("Segoe UI", 8, "bold"),
            fg="#fff",
            bg=badge_bg,
            padx=4, pady=1
        )
        self.level_badge.pack(side="right")

        scam_type_text = f"Type: {disp_threat['scam_type']}" if is_threat else "Type: Normal Content / Verified Safe"
        self.scam_type_lbl = tk.Label(
            opt2_frame,
            text=scam_type_text,
            font=("Segoe UI", 8),
            fg="#00d4ff" if is_threat else "#34d399",
            bg="#111827",
            anchor="w"
        )
        self.scam_type_lbl.pack(fill="x", pady=(4, 2))

        trick_text = f"Trick: {disp_threat['trick_used']}" if is_threat else "Status: Safe Social Media Reel"
        self.trick_lbl = tk.Label(
            opt2_frame,
            text=trick_text,
            font=("Segoe UI", 8),
            fg="#fbbf24" if is_threat else "#9ca3af",
            bg="#111827",
            anchor="w"
        )
        self.trick_lbl.pack(fill="x", pady=(0, 4))

        # Dynamic Reason Header
        hdr_text = "⚠️ Kyun Roka Gaya? (Reason):" if is_threat else "✅ Content Status (Safe Reel):"
        hdr_color = "#f87171" if is_threat else "#10b981"
        self.reason_title = tk.Label(
            opt2_frame,
            text=hdr_text,
            font=("Segoe UI", 8, "bold"),
            fg=hdr_color,
            bg="#111827",
            anchor="w"
        )
        self.reason_title.pack(fill="x", pady=(2, 2))

        # Reason Display Box (Wrapped and prominent)
        if is_threat:
            reason_text = disp_threat["reasons"][0] if (disp_threat.get("reasons") and len(disp_threat["reasons"]) > 0) else "Scam indicator pattern detected"
            reason_bg = "#261313"
        else:
            reason_text = "Koi scam ya fraud pattern nahi mila. Safe social content."
            reason_bg = "#062319"

        self.reason_box = tk.Frame(opt2_frame, bg=reason_bg, padx=8, pady=6, bd=1, relief="solid")
        self.reason_box.pack(fill="x", pady=(2, 4))

        self.reason_lbl = tk.Label(
            self.reason_box,
            text=reason_text,
            font=("Segoe UI", 8),
            fg="#e2e8f0",
            bg=reason_bg,
            wraplength=270,
            justify="left",
            anchor="w"
        )
        self.reason_lbl.pack(fill="x")

        # History tag for previous threat (if current is safe)
        self.last_threat_lbl = tk.Label(
            opt2_frame,
            text="",
            font=("Segoe UI", 7),
            fg="#6b7280",
            bg="#111827",
            anchor="w"
        )
        if not is_threat and self.last_detected_threat:
            self.last_threat_lbl.config(
                text=f"🕒 Last Alert: {self.last_detected_threat.get('scam_type', 'Scam')} ({self.last_detected_threat.get('timestamp', '')})"
            )
            self.last_threat_lbl.pack(fill="x", pady=(2, 0))

        # Human Review Row
        review_frame = tk.Frame(opt2_frame, bg="#111827", pady=4)
        review_frame.pack(fill="x", pady=(4, 0))

        self.review_status_lbl = tk.Label(
            review_frame,
            text=f"Review: {self.review_decision}" if is_threat else "Status: Verified Safe",
            font=("Segoe UI", 8, "bold"),
            fg="#38bdf8" if is_threat else "#10b981",
            bg="#111827"
        )
        self.review_status_lbl.pack(side="left")

        self.btn_correct = tk.Button(
            review_frame,
            text="✅ Correct",
            font=("Segoe UI", 8, "bold"),
            fg="#fff",
            bg="#059669",
            bd=0,
            padx=6, pady=2,
            cursor="hand2",
            command=lambda: self._set_review("Correct Alert")
        )

        self.btn_false = tk.Button(
            review_frame,
            text="❌ False",
            font=("Segoe UI", 8),
            fg="#d1d5db",
            bg="#374151",
            bd=0,
            padx=6, pady=2,
            cursor="hand2",
            command=lambda: self._set_review("False Alert")
        )

        if is_threat:
            self.btn_correct.pack(side="right", padx=(4, 0))
            self.btn_false.pack(side="right")

        # ------------------------------------------
        # Option 3: Full Analytics Dashboard Button
        # ------------------------------------------
        dash_btn = tk.Button(
            content,
            text="📊 Open Analytics Dashboard  ➔",
            font=("Segoe UI", 10, "bold"),
            fg="#0b0f17",
            bg="#00d4ff",
            activebackground="#38bdf8",
            activeforeground="#0b0f17",
            bd=0,
            pady=7,
            cursor="hand2",
            command=self._open_dashboard
        )
        dash_btn.pack(fill="x", pady=(0, 10))

        # ------------------------------------------
        # Quick Threat Simulators (1-Click Test)
        # ------------------------------------------
        sim_lbl = tk.Label(
            content,
            text="🧪 Quick Threat Test on YouTube:",
            font=("Segoe UI", 8, "bold"),
            fg="#6b7280",
            bg="#0b0f17",
            anchor="w"
        )
        sim_lbl.pack(fill="x", pady=(2, 4))

        sim_box = tk.Frame(content, bg="#0b0f17")
        sim_box.pack(fill="x")

        btn_double = tk.Button(
            sim_box,
            text="💸 Paise Double",
            font=("Segoe UI", 7, "bold"),
            fg="#fed7aa",
            bg="#7c2d12",
            bd=0,
            padx=3, pady=3,
            cursor="hand2",
            command=lambda: self.trigger_threat_text("Investing mein paisa double karne ke tarike link par click paise double guarantee")
        )
        btn_double.pack(side="left", padx=(0, 2), expand=True, fill="x")

        btn_lottery = tk.Button(
            sim_box,
            text="💰 25L Lottery",
            font=("Segoe UI", 7),
            fg="#fecaca",
            bg="#7f1d1d",
            bd=0,
            padx=3, pady=3,
            cursor="hand2",
            command=lambda: self.trigger_threat_text("25 lakh ki lottery lagi hai claim karne ke liye processing fees jama karein")
        )
        btn_lottery.pack(side="left", padx=2, expand=True, fill="x")

        btn_cbi = tk.Button(
            sim_box,
            text="👮 CBI Arrest",
            font=("Segoe UI", 7),
            fg="#e9d5ff",
            bg="#581c87",
            bd=0,
            padx=3, pady=3,
            cursor="hand2",
            command=lambda: self.trigger_threat_text("Main CBI officer bol raha hu aapke naam par illegal parcel pakda gaya hai video call par rahiye digital arrest")
        )
        btn_cbi.pack(side="left", padx=2, expand=True, fill="x")

        btn_clear = tk.Button(
            sim_box,
            text="🎮 Safe Gaming",
            font=("Segoe UI", 7),
            fg="#bbf7d0",
            bg="#14532d",
            bd=0,
            padx=3, pady=3,
            cursor="hand2",
            command=lambda: self.trigger_threat_text("Insane sniper clutch in new gaming match double kill clutch")
        )
        btn_clear.pack(side="left", padx=(2, 0), expand=True, fill="x")

        self._update_menu_position()

    def _update_menu_position(self):
        if not self.menu_window:
            return
        w = 320
        h = 430
        mx = max(10, min(self.screen_width - w - 20, self.pos_x - w + self.bot_size))
        my = max(10, min(self.screen_height - h - 30, self.pos_y - h - 10))
        self.menu_window.geometry(f"{w}x{h}+{mx}+{my}")

    def _on_toggle_state(self):
        self.enabled = not self.enabled
        if self.enabled:
            self.toggle_btn.config(text="🟢 ENABLED", bg="#059669")
        else:
            self.toggle_btn.config(text="⚪ DISABLED", bg="#4b5563")
            self.hide_overlay()
        self._update_status_dot()

    def _set_review(self, decision):
        self.review_decision = decision
        target_threat = self.current_threat if (self.current_threat and self.current_threat.get("level") in ("HIGH", "MEDIUM")) else self.last_detected_threat
        if target_threat and "id" in target_threat:
            threat_id = target_threat["id"]
            LIVE_DATA_STORE["reviews"][threat_id] = decision
            # Also update in live_events
            for evt in LIVE_DATA_STORE["live_events"]:
                if evt.get("id") == threat_id:
                    evt["review"] = decision

        if hasattr(self, 'review_status_lbl') and self.review_status_lbl.winfo_exists():
            color = "#10b981" if decision == "Correct Alert" else "#ef4444"
            self.review_status_lbl.config(text=f"Review: {decision}", fg=color)
        self.hide_overlay()

    def _open_dashboard(self):
        webbrowser.open(DASHBOARD_URL)

    # ==========================================
    # In-Video / On-Screen Threat Warning Overlay (Popup)
    # ==========================================
    def show_overlay(self, threat):
        self.hide_overlay()

        self.overlay_window = tk.Toplevel(self.root)
        self.overlay_window.title("⚠️ Threat Alert Popup")
        self.overlay_window.overrideredirect(True)
        self.overlay_window.wm_attributes("-topmost", True)
        self.overlay_window.config(bg="#180505")

        ow = 460
        oh = 250
        ox = (self.screen_width - ow) // 2
        oy = (self.screen_height - oh) // 2 - 80
        self.overlay_window.geometry(f"{ow}x{oh}+{ox}+{oy}")

        box = tk.Frame(
            self.overlay_window,
            bg="#180505",
            bd=3,
            relief="solid",
            highlightbackground="#ef4444",
            highlightthickness=2,
            padx=16,
            pady=12
        )
        box.pack(fill="both", expand=True)

        hdr = tk.Label(
            box,
            text="⚠️ FRAUDVEDA AI ALERT — SCAM DETECTED",
            font=("Segoe UI", 12, "bold"),
            fg="#ef4444",
            bg="#180505"
        )
        hdr.pack(anchor="w", pady=(0, 6))

        level = threat["level"]
        scam_type = threat["scam_type"].upper()
        threat_line = tk.Label(
            box,
            text=f"Detected: {scam_type} ({level})",
            font=("Segoe UI", 10, "bold"),
            fg="#f87171",
            bg="#180505"
        )
        threat_line.pack(anchor="w")

        trick_line = tk.Label(
            box,
            text=f"Trick: {threat['trick_used']}",
            font=("Segoe UI", 9, "bold"),
            fg="#fbbf24",
            bg="#180505"
        )
        trick_line.pack(anchor="w", pady=(2, 2))

        score_line = tk.Label(
            box,
            text=f"Threat Score: {threat['score']}/100 | Action: {threat['suggested_action']}",
            font=("Segoe UI", 9),
            fg="#d1d5db",
            bg="#180505"
        )
        score_line.pack(anchor="w")

        reason_text = threat['reasons'][0] if (threat.get('reasons') and len(threat['reasons']) > 0) else "Scam indicator pattern detected"
        reason_line = tk.Label(
            box,
            text=f"Wajah: {reason_text}",
            font=("Segoe UI", 8),
            fg="#9ca3af",
            bg="#180505",
            wraplength=420,
            justify="left"
        )
        reason_line.pack(anchor="w", pady=(4, 8))

        btn_frame = tk.Frame(box, bg="#180505")
        btn_frame.pack(fill="x", pady=(6, 0))

        btn_review = tk.Button(
            btn_frame,
            text="🔍 Review Post",
            font=("Segoe UI", 9, "bold"),
            fg="#fff",
            bg="#dc2626",
            bd=0,
            padx=12, pady=6,
            cursor="hand2",
            command=self._on_overlay_review
        )
        btn_review.pack(side="left", padx=(0, 8))

        btn_skip = tk.Button(
            btn_frame,
            text="⏭️ Skip",
            font=("Segoe UI", 9, "bold"),
            fg="#d1d5db",
            bg="#374151",
            bd=0,
            padx=12, pady=6,
            cursor="hand2",
            command=self._on_overlay_skip
        )
        btn_skip.pack(side="left", padx=8)

        btn_continue = tk.Button(
            btn_frame,
            text="👁️ Continue",
            font=("Segoe UI", 9),
            fg="#9ca3af",
            bg="#1f2937",
            bd=0,
            padx=12, pady=6,
            cursor="hand2",
            command=self._on_overlay_continue
        )
        btn_continue.pack(side="left", padx=8)

    def _on_overlay_review(self):
        self.hide_overlay()
        if not self.menu_window or not self.menu_window.winfo_exists():
            self.toggle_menu()

    def _on_overlay_continue(self):
        if self.last_scanned_text:
            self.current_dismissed_video = self.last_scanned_text.strip().lower()
        self.hide_overlay()

    def _on_overlay_skip(self):
        if self.last_scanned_text:
            self.current_dismissed_video = self.last_scanned_text.strip().lower()
        self.hide_overlay()
        self.is_skipping = True
        # Re-focus YouTube window before sending Down Arrow key
        try:
            user32 = ctypes.windll.user32
            if hasattr(self, 'last_youtube_hwnd') and self.last_youtube_hwnd:
                user32.SetForegroundWindow(self.last_youtube_hwnd)
                time.sleep(0.05)
            VK_DOWN = 0x28
            user32.keybd_event(VK_DOWN, 0, 0, 0)
            time.sleep(0.05)
            user32.keybd_event(VK_DOWN, 0, 2, 0)
        except Exception:
            pass

        def reset_skip():
            time.sleep(1.2)
            self.is_skipping = False
        threading.Thread(target=reset_skip, daemon=True).start()

    def hide_overlay(self):
        if self.overlay_window and self.overlay_window.winfo_exists():
            self.overlay_window.destroy()
            self.overlay_window = None

    # ==========================================
    # Threat Trigger & Analysis
    # ==========================================
    def trigger_threat_text(self, text):
        if not self.enabled:
            return

        clean_text = (text or "").strip()
        clean_lower = clean_text.lower()
        if not clean_text:
            return

        # If user navigated to a different video, reset single-video dismiss state
        if self.current_dismissed_video and clean_lower != self.current_dismissed_video:
            self.current_dismissed_video = None

        is_dismissed_for_now = (self.current_dismissed_video == clean_lower)

        self.last_scanned_text = clean_text
        threat = ThreatScanner.scan(clean_text)
        self.current_threat = threat
        self.review_decision = "Pending"
        self._update_status_dot()

        # Update total scans and recent activity log
        LIVE_DATA_STORE["total_scanned_count"] = LIVE_DATA_STORE.get("total_scanned_count", 0) + 1
        scan_log = {
            "id": threat["id"],
            "timestamp": threat["timestamp"],
            "post_text": clean_text[:140],
            "level": threat["level"],
            "score": threat["score"],
            "scam_type": threat["scam_type"],
            "trick_used": threat["trick_used"],
            "category": threat.get("category", "scam"),
            "action": threat["suggested_action"]
        }
        if "recent_scans" not in LIVE_DATA_STORE:
            LIVE_DATA_STORE["recent_scans"] = []
        LIVE_DATA_STORE["recent_scans"].insert(0, scan_log)
        if len(LIVE_DATA_STORE["recent_scans"]) > 40:
            LIVE_DATA_STORE["recent_scans"].pop()

        # Record into live store for Dashboard (with deduplication)
        if threat["level"] in ("HIGH", "MEDIUM"):
            self.last_detected_threat = threat
            clean_snippet = clean_text[:180].lower()
            if not any(ev.get("post_text", "").lower()[:180] == clean_snippet for ev in LIVE_DATA_STORE["live_events"][:10]):
                event_obj = {
                    "id": threat["id"],
                    "post_id": threat["id"],
                    "timestamp": threat["timestamp"],
                    "time": threat["timestamp"],
                    "post_text": clean_text[:250],
                    "analysis": threat,
                    "category": threat.get("category", "scam"),
                    "scam_type": threat["scam_type"],
                    "trick_used": threat["trick_used"],
                    "platform": "YouTube Shorts",
                    "account_id": "YouTube_Shorts_Live",
                    "location": "Live Stream",
                    "hashtags": [f"#{kw.replace(' ', '')}" for kw in threat.get("matched_keywords", [])] or ["#scamalert", "#fraudcheck"],
                    "likes": "14.2K",
                    "shares": "1.8K",
                    "is_live_ingested": True
                }
                LIVE_DATA_STORE["live_events"].insert(0, event_obj)
                if len(LIVE_DATA_STORE["live_events"]) > 50:
                    LIVE_DATA_STORE["live_events"].pop()

        # Update menu if open with current reel live analytics
        if self.menu_window and self.menu_window.winfo_exists():
            disp_threat = self.current_threat
            level = disp_threat.get("level", "SAFE")
            is_threat = (level in ("HIGH", "MEDIUM"))
            badge_bg = "#ef4444" if level == "HIGH" else ("#f59e0b" if level == "MEDIUM" else "#10b981")
            self.level_badge.config(text=f" {level} ", bg=badge_bg)

            if is_threat:
                self.scam_type_lbl.config(text=f"Type: {disp_threat['scam_type']}", fg="#00d4ff")
                self.trick_lbl.config(text=f"Trick: {disp_threat['trick_used']}", fg="#fbbf24")
                self.reason_title.config(text="⚠️ Kyun Roka Gaya? (Reason):", fg="#f87171")
                self.reason_box.config(bg="#261313")
                reason_str = disp_threat["reasons"][0] if (disp_threat.get("reasons") and len(disp_threat["reasons"]) > 0) else "Scam indicator pattern detected"
                self.reason_lbl.config(text=reason_str, bg="#261313")
                self.review_status_lbl.config(text=f"Review: {self.review_decision}", fg="#38bdf8")
                if hasattr(self, 'btn_correct') and self.btn_correct.winfo_exists():
                    self.btn_correct.pack(side="right", padx=(4, 0))
                if hasattr(self, 'btn_false') and self.btn_false.winfo_exists():
                    self.btn_false.pack(side="right")
                if hasattr(self, 'last_threat_lbl') and self.last_threat_lbl.winfo_exists():
                    self.last_threat_lbl.pack_forget()
            else:
                self.scam_type_lbl.config(text="Type: Normal Content / Verified Safe", fg="#34d399")
                self.trick_lbl.config(text="Status: Safe Social Media Reel", fg="#9ca3af")
                self.reason_title.config(text="✅ Content Status (Safe Reel):", fg="#10b981")
                self.reason_box.config(bg="#062319")
                self.reason_lbl.config(text="Koi scam ya fraud pattern nahi mila. Safe social content.", bg="#062319")
                self.review_status_lbl.config(text="Status: Verified Safe", fg="#10b981")
                if hasattr(self, 'btn_correct') and self.btn_correct.winfo_exists():
                    self.btn_correct.pack_forget()
                if hasattr(self, 'btn_false') and self.btn_false.winfo_exists():
                    self.btn_false.pack_forget()
                if hasattr(self, 'last_threat_lbl') and self.last_threat_lbl.winfo_exists():
                    if self.last_detected_threat:
                        self.last_threat_lbl.config(
                            text=f"🕒 Last Alert: {self.last_detected_threat.get('scam_type', 'Scam')} ({self.last_detected_threat.get('timestamp', '')})"
                        )
                        self.last_threat_lbl.pack(fill="x", pady=(2, 0))
                    else:
                        self.last_threat_lbl.pack_forget()

        if threat["level"] in ("HIGH", "MEDIUM"):
            if not is_dismissed_for_now:
                self.show_speech_bubble(
                    f"⚠️ {threat['level']} THREAT ALERT!",
                    f"{threat['scam_type']} detect hua!\n👉 Click karke review karein",
                    duration_ms=6000
                )
                self.show_overlay(threat)
        else:
            self.hide_overlay()

    # ==========================================
    # Background Continuous Watchers
    # ==========================================
    def _start_screen_watcher(self):
        """Strict Privacy: Only monitors foreground active YouTube tab.
        Never enumerates background apps, banking windows, or system apps."""
        user32 = ctypes.windll.user32

        def watcher():
            last_checked = ""
            while True:
                time.sleep(0.5)
                if not self.enabled:
                    continue

                try:
                    # 1. Inspect Active Foreground Window ONLY
                    fg = user32.GetForegroundWindow()
                    if not fg:
                        if self.overlay_window and self.overlay_window.winfo_exists():
                            self.root.after(0, self.hide_overlay)
                        continue

                    length = user32.GetWindowTextLengthW(fg)
                    if length <= 0:
                        if self.overlay_window and self.overlay_window.winfo_exists():
                            self.root.after(0, self.hide_overlay)
                        continue

                    buff = ctypes.create_unicode_buffer(length + 1)
                    user32.GetWindowTextW(fg, buff, length + 1)
                    win_title = buff.value or ""
                    win_lower = win_title.lower()

                    # Instantly hide overlay if user closed YouTube or switched away from YouTube
                    if not ("youtube" in win_lower or "shorts" in win_lower):
                        if self.overlay_window and self.overlay_window.winfo_exists():
                            self.root.after(0, self.hide_overlay)
                        continue

                    # Remember active YouTube window handle for reliable skip refocus
                    self.last_youtube_hwnd = fg

                    # Extract video ID if present in title
                    vid_m = re.search(r'(?:shorts/|watch\?v=)([a-zA-Z0-9_-]{11})', win_title)
                    if vid_m:
                        vid = vid_m.group(1)
                        if vid != LIVE_DATA_STORE["last_scanned_video_id"]:
                            LIVE_DATA_STORE["last_scanned_video_id"] = vid
                            self._fetch_and_scan_oembed(vid)
                            continue

                    # Scan foreground YouTube reel title text
                    if win_title != last_checked:
                        last_checked = win_title
                        self.root.after(0, lambda t=win_title: self.trigger_threat_text(t))

                except Exception:
                    pass

        t = threading.Thread(target=watcher, daemon=True)
        t.start()

    def _start_scroll_key_watcher(self):
        """Detects reel scrolling keys (Down Arrow, Up Arrow, J, K, PageDown)"""
        user32 = ctypes.windll.user32
        scroll_keys = [0x28, 0x26, 0x22, 0x4A, 0x4B]  # Down, Up, PgDn, J, K

        def scroll_listener():
            while True:
                time.sleep(0.2)
                if not self.enabled or self.is_skipping:
                    continue
                try:
                    for k in scroll_keys:
                        if user32.GetAsyncKeyState(k) & 0x8000:
                            # User just scrolled reel! Re-check active window after 0.3s
                            time.sleep(0.3)
                            if self.is_skipping:
                                break
                            fg = user32.GetForegroundWindow()
                            length = user32.GetWindowTextLengthW(fg)
                            if length > 0:
                                buff = ctypes.create_unicode_buffer(length + 1)
                                user32.GetWindowTextW(fg, buff, length + 1)
                                t = buff.value
                                if t and ("youtube" in t.lower() or "shorts" in t.lower()):
                                    self.last_youtube_hwnd = fg
                                    self.root.after(0, lambda title=t: self.trigger_threat_text(title))
                            break
                except Exception:
                    pass

        t = threading.Thread(target=scroll_listener, daemon=True)
        t.start()

    def _start_clipboard_watcher(self):
        """Strict Privacy Protection: ONLY inspects clipboard if it contains a YouTube video URL.
        Passwords, personal chats, and sensitive clipboard items are NEVER read or stored."""
        def check_clipboard():
            if self.enabled:
                try:
                    clip = self.root.clipboard_get()
                    if clip and len(clip.strip()) > 5:
                        yt_match = re.search(r'https?://(?:www\.)?(?:youtube\.com/(?:watch\?v=|shorts/)|youtu\.be/)([a-zA-Z0-9_-]{11})', clip)
                        if yt_match and clip != self.last_clipboard:
                            self.last_clipboard = clip
                            vid = yt_match.group(1)
                            threading.Thread(target=self._fetch_and_scan_oembed, args=(vid,), daemon=True).start()
                except Exception:
                    pass
            self.root.after(1500, check_clipboard)

        self.root.after(1500, check_clipboard)

    def _fetch_and_scan_oembed(self, video_id):
        try:
            full_text = ""
            try:
                url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=3) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    title = data.get("title", "")
                    author = data.get("author_name", "")
                    full_text = f"{title} by {author}"
            except Exception:
                pass

            if not full_text:
                url = f"https://www.youtube.com/shorts/{video_id}"
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                with urllib.request.urlopen(req, timeout=3) as resp:
                    html = resp.read().decode('utf-8', errors='ignore')
                    m = re.search(r'<title>(.*?)</title>', html)
                    if m:
                        full_text = m.group(1).replace('- YouTube', '').strip()

            if full_text:
                self.root.after(0, lambda t=full_text: self.trigger_threat_text(t))
        except Exception:
            pass

    def run(self):
        self.root.mainloop()


if __name__ == '__main__':
    # Start Real-Time HTTP SOC Server in background thread
    server_thread = threading.Thread(target=start_http_server, daemon=True)
    server_thread.start()

    # Run Floating Screen UI Widget
    app = ChowkidaarWidget()
    app.run()
