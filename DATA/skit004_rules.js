// SKIT004 60 Official Hackathon Rules Engine
const SKIT004_RULES = [
  {
    "id": 1,
    "scam_type": "Paise Double Scam",
    "trick_used": "Paise double ka lalach",
    "risk_level": "High",
    "keywords": [
      "link par click",
      "1000 lagao",
      "2000 wapas",
      "guarantee",
      "paise double"
    ],
    "reason": "Kam time mein paise double nahi hote, ye jhootha vaada hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 2,
    "scam_type": "Cashback OTP Scam",
    "trick_used": "OTP maangna",
    "risk_level": "High",
    "keywords": [
      "otp",
      "cashback",
      "comment mein likho"
    ],
    "reason": "OTP kisi ko nahi dete, OTP dene se account khali ho jata hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 3,
    "scam_type": "Fake Govt Scheme",
    "trick_used": "Personal details maangna",
    "risk_level": "High",
    "keywords": [
      "aadhaar",
      "bank details",
      "10000 rupay",
      "link"
    ],
    "reason": "Sarkar kabhi reel ke link se details nahi maangti",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 4,
    "scam_type": "Lottery Scam",
    "trick_used": "Pehle fees maangna",
    "risk_level": "High",
    "keywords": [
      "lottery",
      "claim",
      "processing fees",
      "link",
      "25 lakh"
    ],
    "reason": "Bina ticket kharide lottery nahi lagti. Fees maangna scam ki nishani hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 5,
    "scam_type": "KYC Phishing",
    "trick_used": "Darr aur jaldi",
    "risk_level": "High",
    "keywords": [
      "account band",
      "aaj raat",
      "kyc",
      "bit.ly"
    ],
    "reason": "Chhote fake link, darr dikha kar login churana",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 6,
    "scam_type": "Fake Job Scam",
    "trick_used": "Pehle fees maangna",
    "risk_level": "High",
    "keywords": [
      "ghar baithe",
      "roz 3000",
      "registration fees",
      "whatsapp"
    ],
    "reason": "Job ke naam par pehle paise maangna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 7,
    "scam_type": "Fake Loan App",
    "trick_used": "Fake app download",
    "risk_level": "High",
    "keywords": [
      "instant loan",
      "bina documents",
      "app download",
      "50000"
    ],
    "reason": "Fake loan app aapke contacts aur photos chura leta hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 8,
    "scam_type": "Crypto Investment Fraud",
    "trick_used": "Unrealistic return",
    "risk_level": "High",
    "keywords": [
      "5 guna",
      "vip group",
      "telegram",
      "entry fees"
    ],
    "reason": "Koi bhi investment 10 din mein 5 guna nahi hota",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 9,
    "scam_type": "Parcel Scam",
    "trick_used": "Fake courier charge",
    "risk_level": "High",
    "keywords": [
      "parcel",
      "customs",
      "delivery charge",
      "pay karo"
    ],
    "reason": "Fake courier ke naam par paise lena",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 10,
    "scam_type": "Electricity Bill Scam",
    "trick_used": "Darr aur jaldi",
    "risk_level": "High",
    "keywords": [
      "connection kat jayega",
      "aaj raat",
      "call karo",
      "bijli"
    ],
    "reason": "Jaldi mein galat kaam karwane ki koshish",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 11,
    "scam_type": "Fake Customer Care",
    "trick_used": "Remote access app",
    "risk_level": "High",
    "keywords": [
      "customer care",
      "anydesk",
      "refund"
    ],
    "reason": "AnyDesk se scammer poora phone control kar leta hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 12,
    "scam_type": "UPI QR Scam",
    "trick_used": "QR scan aur PIN",
    "risk_level": "High",
    "keywords": [
      "upi refund",
      "qr scan",
      "pin"
    ],
    "reason": "Paise lene ke liye QR scan ya PIN nahi daalte. Ulte paise kat jate hain",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 13,
    "scam_type": "Digital Arrest Scam",
    "trick_used": "Police ka darr",
    "risk_level": "High",
    "keywords": [
      "cbi officer",
      "illegal parcel",
      "video call par rahiye",
      "digital arrest"
    ],
    "reason": "Police video call par arrest nahi karti",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 14,
    "scam_type": "Romance Gift Scam",
    "trick_used": "Gift ke naam par fees",
    "risk_level": "High",
    "keywords": [
      "army officer",
      "gift",
      "customs fees"
    ],
    "reason": "Anjaan insaan se gift ke naam par paise maangna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 15,
    "scam_type": "Fake Govt Scheme",
    "trick_used": "Free ka lalach",
    "risk_level": "High",
    "keywords": [
      "free laptop",
      "aadhaar",
      "form",
      "link"
    ],
    "reason": "Personal details churane ki koshish",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 16,
    "scam_type": "Phishing",
    "trick_used": "Fake login page",
    "risk_level": "High",
    "keywords": [
      "account hack",
      "password reset",
      "login karo"
    ],
    "reason": "Fake page se password churate hain",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 17,
    "scam_type": "Fake Offer",
    "trick_used": "Forward chain",
    "risk_level": "Medium",
    "keywords": [
      "free recharge",
      "forward karo",
      "number daalo"
    ],
    "reason": "Chain forward se aur logon tak phailta hai, number churate hain",
    "suggested_action": "Warning popup"
  },
  {
    "id": 18,
    "scam_type": "Black Magic Fraud",
    "trick_used": "Andhvishwas",
    "risk_level": "Medium",
    "keywords": [
      "tantrik",
      "upay",
      "pehle bhejo"
    ],
    "reason": "Andhvishwas ke naam par paise lena",
    "suggested_action": "Warning popup"
  },
  {
    "id": 19,
    "scam_type": "Task Scam",
    "trick_used": "Chhota profit, phir bada deposit",
    "risk_level": "High",
    "keywords": [
      "har like par",
      "deposit",
      "task"
    ],
    "reason": "Pehle chhota profit dikha ke baad mein bada deposit lete hain",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 20,
    "scam_type": "Fake Job Scam",
    "trick_used": "Darr aur bank details maangna",
    "risk_level": "High",
    "keywords": [
      "daily 5000",
      "id card photo",
      "bank details"
    ],
    "reason": "ID proof aur bank details churane ki koshish",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 21,
    "scam_type": "SIM Block Scam",
    "trick_used": "Darr aur jaldi",
    "risk_level": "High",
    "keywords": [
      "sim block",
      "2 ghanta",
      "9 dabao"
    ],
    "reason": "Fake call transfer scam",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 22,
    "scam_type": "Paper Leak Scam",
    "trick_used": "Paper ka lalach",
    "risk_level": "High",
    "keywords": [
      "paper leak",
      "answer key",
      "500",
      "upi"
    ],
    "reason": "Paper leak ke naam par thagi",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 23,
    "scam_type": "Fake APK Scam",
    "trick_used": "Fake app",
    "risk_level": "High",
    "keywords": [
      "apk",
      "bank app",
      "login"
    ],
    "reason": "Play Store ke bahar ki APK mein virus hota hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 24,
    "scam_type": "Hacking Tool Scam",
    "trick_used": "Fake tool download",
    "risk_level": "High",
    "keywords": [
      "hack",
      "5 minute",
      "tool download",
      "link"
    ],
    "reason": "Hacking tool ke naam par virus ya password chori",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 25,
    "scam_type": "PIN Scam",
    "trick_used": "PIN maangna",
    "risk_level": "High",
    "keywords": [
      "card number",
      "pin bhejo"
    ],
    "reason": "PIN kisi ko nahi batate",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 26,
    "scam_type": "Police Impersonation",
    "trick_used": "Police ka darr",
    "risk_level": "High",
    "keywords": [
      "fir",
      "bachna hai",
      "20000",
      "upi"
    ],
    "reason": "Police ke naam lekar paise maangna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 27,
    "scam_type": "Gaming Phishing",
    "trick_used": "Game ka lalach",
    "risk_level": "High",
    "keywords": [
      "unlimited diamonds",
      "free",
      "password daalo"
    ],
    "reason": "Game account churane ki koshish",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 28,
    "scam_type": "Fake Job Scam",
    "trick_used": "Pehle fees maangna",
    "risk_level": "High",
    "keywords": [
      "data entry",
      "registration fee",
      "refund"
    ],
    "reason": "Pehle paise lena aur baad mein gayab ho jana",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 29,
    "scam_type": "Fake Charity",
    "trick_used": "Emotion se paise",
    "risk_level": "Medium",
    "keywords": [
      "beti bimaar",
      "turant upi",
      "zaroori"
    ],
    "reason": "Emotion dikha ke paise nikalna",
    "suggested_action": "Warning popup"
  },
  {
    "id": 30,
    "scam_type": "Card Details Scam",
    "trick_used": "CVV maangna",
    "risk_level": "High",
    "keywords": [
      "card details",
      "cvv",
      "limit badhane"
    ],
    "reason": "CVV kabhi share nahi karte",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 31,
    "scam_type": "Stock Tips Fraud",
    "trick_used": "Sure shot ka lalach",
    "risk_level": "High",
    "keywords": [
      "sure shot",
      "profit",
      "advance"
    ],
    "reason": "Share market mein koi guarantee nahi hoti",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 32,
    "scam_type": "Sextortion",
    "trick_used": "Blackmail",
    "risk_level": "High",
    "keywords": [
      "private photos",
      "warna bhej dunga"
    ],
    "reason": "Dhamki dekar paise maangna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 33,
    "scam_type": "Fake Sale Scam",
    "trick_used": "Bahut sasta offer",
    "risk_level": "High",
    "keywords": [
      "iphone 999",
      "fake sale",
      "link"
    ],
    "reason": "Itna sasta iPhone nahi milta, link se paise ya details chori",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 34,
    "scam_type": "Aadhaar Update Scam",
    "trick_used": "Darr aur jaldi",
    "risk_level": "High",
    "keywords": [
      "aadhaar update",
      "band ho jayega",
      "link"
    ],
    "reason": "Aadhaar update ke liye fake link",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 35,
    "scam_type": "Tax Refund Scam",
    "trick_used": "Refund ka lalach",
    "risk_level": "High",
    "keywords": [
      "tax refund",
      "bank details",
      "link"
    ],
    "reason": "Tax department sms ya link se bank details nahi maangta",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 36,
    "scam_type": "Scholarship Scam",
    "trick_used": "OTP maangna",
    "risk_level": "High",
    "keywords": [
      "scholarship",
      "25000",
      "otp",
      "claim"
    ],
    "reason": "Scholarship ke naam par OTP churana",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 37,
    "scam_type": "Trading App Fraud",
    "trick_used": "Roz kamai ka lalach",
    "risk_level": "High",
    "keywords": [
      "roz 10000",
      "trading app",
      "pehle 5000"
    ],
    "reason": "Fake trading app mein paise dikhte hain, nikalte nahi",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 38,
    "scam_type": "Instagram Verification Scam",
    "trick_used": "Blue tick ka lalach",
    "risk_level": "High",
    "keywords": [
      "blue tick",
      "verify",
      "password"
    ],
    "reason": "Fake verification page se password chori",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 39,
    "scam_type": "OLX Car Scam",
    "trick_used": "Army ke naam par advance",
    "risk_level": "High",
    "keywords": [
      "army",
      "advance",
      "transfer"
    ],
    "reason": "Fake army seller advance leke gayab",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 40,
    "scam_type": "KBC Lottery Scam",
    "trick_used": "Fake lottery",
    "risk_level": "High",
    "keywords": [
      "kbc lottery",
      "25 lakh",
      "whatsapp"
    ],
    "reason": "KBC kabhi WhatsApp par lottery nahi deta",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 41,
    "scam_type": "Gas Subsidy Scam",
    "trick_used": "Subsidy ka lalach",
    "risk_level": "High",
    "keywords": [
      "subsidy",
      "aadhaar",
      "account number",
      "link"
    ],
    "reason": "Subsidy ke naam par details churana",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 42,
    "scam_type": "Insurance Bonus Scam",
    "trick_used": "Pehle tax maangna",
    "risk_level": "High",
    "keywords": [
      "bonus pending",
      "tax pay",
      "1 lakh"
    ],
    "reason": "Pehle paise maangna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 43,
    "scam_type": "Lucky Draw Scam",
    "trick_used": "Pehle fees maangna",
    "risk_level": "High",
    "keywords": [
      "lucky draw",
      "select",
      "999 bhejo"
    ],
    "reason": "Fake lucky draw",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 44,
    "scam_type": "Video Call Scam",
    "trick_used": "Video call se blackmail",
    "risk_level": "High",
    "keywords": [
      "video call",
      "inaam",
      "utha lo"
    ],
    "reason": "Video call record karke blackmail kiya jata hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 45,
    "scam_type": "Paytm KYC Scam",
    "trick_used": "Darr aur jaldi",
    "risk_level": "High",
    "keywords": [
      "kyc expire",
      "10 rupay bhej",
      "wallet band"
    ],
    "reason": "10 rupay ke naam par poora account khali",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 46,
    "scam_type": "Matrimonial Scam",
    "trick_used": "Registration fees",
    "risk_level": "Medium",
    "keywords": [
      "matrimonial",
      "registration",
      "photo dikhaungi"
    ],
    "reason": "Shaadi ke naam par paise lena",
    "suggested_action": "Warning popup"
  },
  {
    "id": 47,
    "scam_type": "Telegram Earning Scam",
    "trick_used": "Deposit maangna",
    "risk_level": "High",
    "keywords": [
      "telegram",
      "har din 500",
      "deposit"
    ],
    "reason": "Telegram par fake earning group",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 48,
    "scam_type": "Fake Gift Voucher",
    "trick_used": "Voucher ka lalach",
    "risk_level": "Medium",
    "keywords": [
      "gift voucher",
      "link",
      "number daalo"
    ],
    "reason": "Voucher ke naam par number churana",
    "suggested_action": "Warning popup"
  },
  {
    "id": 49,
    "scam_type": "Bank Phishing",
    "trick_used": "Fake bank page",
    "risk_level": "High",
    "keywords": [
      "account suspend",
      "net banking login",
      "link"
    ],
    "reason": "Fake bank page se login chori",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 50,
    "scam_type": "Fake Business Investment",
    "trick_used": "Pakka profit ka vaada",
    "risk_level": "High",
    "keywords": [
      "10000 lagao",
      "har mahine profit pakka"
    ],
    "reason": "Pakka profit ka vaada jhootha hota hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 51,
    "scam_type": "OTP Scam",
    "trick_used": "OTP maangna",
    "risk_level": "High",
    "keywords": [
      "lucky number",
      "1 crore",
      "otp"
    ],
    "reason": "OTP maangna scam hai",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 52,
    "scam_type": "Paise Double Scam",
    "trick_used": "Fake proof",
    "risk_level": "High",
    "keywords": [
      "link par click",
      "paise double",
      "5 lakh",
      "proof"
    ],
    "reason": "Fake screenshot dikha ke bharosa jeetna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 53,
    "scam_type": "Fake Recharge Offer",
    "trick_used": "OTP maangna",
    "risk_level": "High",
    "keywords": [
      "free recharge",
      "otp",
      "link"
    ],
    "reason": "Fake offer se OTP churana",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 54,
    "scam_type": "WhatsApp Ban Scam",
    "trick_used": "Darr aur jaldi",
    "risk_level": "High",
    "keywords": [
      "whatsapp band",
      "verify",
      "link"
    ],
    "reason": "Fake link se WhatsApp account hack",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 55,
    "scam_type": "GPay Double Scam",
    "trick_used": "Chhota test, phir bada",
    "risk_level": "High",
    "keywords": [
      "paisa double",
      "500 bhej",
      "check karo"
    ],
    "reason": "Pehle chhota wapas deke bharosa jeetna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 56,
    "scam_type": "SIM Misuse Scam",
    "trick_used": "Jail ka darr",
    "risk_level": "High",
    "keywords": [
      "aadhaar se sim",
      "jail",
      "turant call"
    ],
    "reason": "Darr dikha ke paise ya details lena",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 57,
    "scam_type": "Fake Rental Scam",
    "trick_used": "Advance maangna",
    "risk_level": "High",
    "keywords": [
      "kiraya kam",
      "advance",
      "courier chaabi"
    ],
    "reason": "Ghar dikhaye bina advance lena",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 58,
    "scam_type": "Fake Referral App",
    "trick_used": "Bank account link",
    "risk_level": "High",
    "keywords": [
      "har refer par",
      "app install",
      "bank account link"
    ],
    "reason": "Fake app se bank details chori",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 59,
    "scam_type": "Fake Loan Scam",
    "trick_used": "Processing fee",
    "risk_level": "High",
    "keywords": [
      "0% interest",
      "processing fee"
    ],
    "reason": "Pehle fees maangna",
    "suggested_action": "Popup + analyst alert"
  },
  {
    "id": 60,
    "scam_type": "Netflix Phishing",
    "trick_used": "Card details maangna",
    "risk_level": "Medium",
    "keywords": [
      "netflix",
      "card details",
      "link"
    ],
    "reason": "Fake page se card details chori",
    "suggested_action": "Warning popup"
  }
];
