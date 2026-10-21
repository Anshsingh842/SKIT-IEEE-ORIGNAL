/**
 * data.js - Fictional Demo Posts and Baselines for Threat Monitoring
 * All user IDs are anonymized (user_001, etc.)
 * All links use safe placeholder domains (example.com, example.invalid, example.test)
 * No real personal information or allegations.
 */

const SAMPLE_POSTS = [
  // 1. Cybercrime / Phishing Scam - HIGH RISK
  {
    post_id: "POST-101",
    account_id: "user_092",
    account_age_days: 2,
    posts_last_hour: 14,
    post_text: "URGENT NOTICE: Your electricity connection will be disconnected tonight by 9:30 PM due to unpaid bill. Immediately pay Rs 10 to update bill or call customer care at 1800-000-TEST. Click link: https://example.com/ebill-update",
    time: "2026-10-14 14:15:00",
    timestamp: 1792053900000,
    location: "Jaipur",
    hashtags: ["#ElectricityBill", "#UrgentUpdate", "#CustomerSupport"],
    media_type: "reel",
    video_placeholder: "Power Grid Meter Alert Graphics",
    verified: false
  },

  // 2. Cybercrime / Financial Scam - HIGH RISK
  {
    post_id: "POST-102",
    account_id: "user_114",
    account_age_days: 4,
    posts_last_hour: 22,
    post_text: "Congratulations! You won 25 Lakh Rupees in State Festive Lucky Draw! Send your Aadhaar copy and OTP immediately to claim prize into your bank account. Visit: https://example.test/claim-lottery",
    time: "2026-10-14 14:18:00",
    timestamp: 1792054080000,
    location: "Delhi",
    hashtags: ["#LotteryWinner", "#FreeMoney", "#LuckyDraw", "#CashPrize"],
    media_type: "reel",
    video_placeholder: "Golden Confetti with Cheque Animation",
    verified: false
  },

  // 3. Cyber Awareness (Legitimate / Safe counter-example) - LOW RISK
  {
    post_id: "POST-103",
    account_id: "user_007",
    account_age_days: 620,
    posts_last_hour: 1,
    post_text: "Cyber Safety Advisory: Banks and electricity boards NEVER ask for OTP, PIN, or remote app downloads (AnyDesk/TeamViewer). Always verify notifications via official portals. Stay alert!",
    time: "2026-10-14 13:45:00",
    timestamp: 1792052100000,
    location: "Mumbai",
    hashtags: ["#CyberSafety", "#StayAlert", "#Awareness", "#FactCheck"],
    media_type: "reel",
    video_placeholder: "Cyber Police Explainer Motion Graphic",
    verified: true
  },

  // 4. Misinformation / Panic Claim - HIGH RISK
  {
    post_id: "POST-104",
    account_id: "user_308",
    account_age_days: 9,
    posts_last_hour: 8,
    post_text: "100% VERIFIED SECRET LEAK: Major private banks have collapsed today and ATM cash withdrawals will be capped at 500 Rs starting midnight. Mainstream media is hiding this! Withdraw all your savings immediately!",
    time: "2026-10-14 14:22:00",
    timestamp: 1792054320000,
    location: "Bengaluru",
    hashtags: ["#BankCrisis", "#BreakingNews", "#HiddenTruth", "#Emergency"],
    media_type: "reel",
    video_placeholder: "Flashing Red Breaking News Siren Screen",
    verified: false
  },

  // 5. Misinformation / Suspicious Health Claim - MEDIUM RISK
  {
    post_id: "POST-105",
    account_id: "user_419",
    account_age_days: 45,
    posts_last_hour: 3,
    post_text: "Sharing domestic tip: Neem leaves boiled in water is an ancient viral fever remedy, doctors won't tell you about home remedies. Forward to family for awareness. https://example.invalid/natural-cure",
    time: "2026-10-14 13:10:00",
    timestamp: 1792050000000,
    location: "Hyderabad",
    hashtags: ["#HealthTips", "#Remedy", "#SecretRemedy"],
    media_type: "reel",
    video_placeholder: "Herbal Remedies Video Reel",
    verified: false
  },

  // 6. Coordinated Bot Activity (Instance A) - HIGH RISK
  {
    post_id: "POST-106",
    account_id: "user_801",
    account_age_days: 1,
    posts_last_hour: 35,
    post_text: "BOYCOTT ALL METRO TRAVEL! Metro fares are tripling from tomorrow morning without public notice! Share to 10 groups now to stop this looting! #BoycottMetro",
    time: "2026-10-14 14:28:00",
    timestamp: 1792054680000,
    location: "Delhi",
    hashtags: ["#BoycottMetro", "#FareHikeExposed", "#PublicOutrage"],
    media_type: "reel",
    video_placeholder: "Crowded Metro Station B-Roll",
    verified: false
  },

  // 7. Coordinated Bot Activity (Instance B - Duplicate Copy-Paste) - HIGH RISK
  {
    post_id: "POST-107",
    account_id: "user_802",
    account_age_days: 1,
    posts_last_hour: 29,
    post_text: "BOYCOTT ALL METRO TRAVEL! Metro fares are tripling from tomorrow morning without public notice! Share to 10 groups now to stop this looting! #BoycottMetro",
    time: "2026-10-14 14:29:00",
    timestamp: 1792054740000,
    location: "Delhi",
    hashtags: ["#BoycottMetro", "#FareHikeExposed", "#PublicOutrage"],
    media_type: "reel",
    video_placeholder: "Crowded Metro Station B-Roll",
    verified: false
  },

  // 8. Coordinated Bot Activity (Instance C - Duplicate Copy-Paste) - HIGH RISK
  {
    post_id: "POST-108",
    account_id: "user_803",
    account_age_days: 2,
    posts_last_hour: 40,
    post_text: "BOYCOTT ALL METRO TRAVEL! Metro fares are tripling from tomorrow morning without public notice! Share to 10 groups now to stop this looting! #BoycottMetro",
    time: "2026-10-14 14:31:00",
    timestamp: 1792054860000,
    location: "Delhi",
    hashtags: ["#BoycottMetro", "#FareHikeExposed", "#PublicOutrage"],
    media_type: "reel",
    video_placeholder: "Crowded Metro Station B-Roll",
    verified: false
  },

  // 9. Social Tension / Incitement Indicator - HIGH RISK
  {
    post_id: "POST-109",
    account_id: "user_550",
    account_age_days: 5,
    posts_last_hour: 12,
    post_text: "We will not tolerate this injustice! Everyone gather at the city square tonight with sticks and stones. Badla lenge aur sabak sikhao, aag laga do across the entire zone!",
    time: "2026-10-14 14:33:00",
    timestamp: 1792054980000,
    location: "Jaipur",
    hashtags: ["#ProtestNow", "#TakeRevenge", "#SadakParAao"],
    media_type: "reel",
    video_placeholder: "Aggressive Speech at Protest Ground",
    verified: false
  },

  // 10. Social Tension / Provocative Language - MEDIUM RISK
  {
    post_id: "POST-110",
    account_id: "user_612",
    account_age_days: 18,
    posts_last_hour: 4,
    post_text: "The local administration is ignoring our demands. If they don't respond in 2 hours, sadak par aao and we will block all national highways permanently!",
    time: "2026-10-14 14:05:00",
    timestamp: 1792053300000,
    location: "Chandigarh",
    hashtags: ["#HighwayJam", "#SadakParAao", "#Ultimatum"],
    media_type: "reel",
    video_placeholder: "Highway Traffic Jam Scene",
    verified: false
  },

  // 11. Normal / Safe Post - LOW RISK
  {
    post_id: "POST-111",
    account_id: "user_021",
    account_age_days: 340,
    posts_last_hour: 1,
    post_text: "Beautiful rainy morning in Jaipur! Tried hot kulhad chai and pyaaz kachori at Jal Mahal road. Hope everyone has a peaceful and safe Wednesday!",
    time: "2026-10-14 09:30:00",
    timestamp: 1792036800000,
    location: "Jaipur",
    hashtags: ["#MonsoonVibes", "#JaipurDiaries", "#Foodie", "#ChaiTime"],
    media_type: "reel",
    video_placeholder: "Steaming Kulhad Chai & Rain Drops",
    verified: false
  },

  // 12. Normal / Safe Tech Post - LOW RISK
  {
    post_id: "POST-112",
    account_id: "user_045",
    account_age_days: 512,
    posts_last_hour: 2,
    post_text: "Attending our city hackathon today! Building awesome AI tools to make the internet safer for everybody. Best wishes to all student teams presenting prototypes!",
    time: "2026-10-14 11:20:00",
    timestamp: 1792043400000,
    location: "Bengaluru",
    hashtags: ["#Hackathon2026", "#AISafety", "#StudentDevelopers", "#TechIndia"],
    media_type: "reel",
    video_placeholder: "Students Coding on Laptops in Auditorium",
    verified: false
  },

  // 13. Emerging Topic Surge Indicator - MEDIUM RISK
  {
    post_id: "POST-113",
    account_id: "user_777",
    account_age_days: 12,
    posts_last_hour: 7,
    post_text: "Unusual power outage reported across 4 substations simultaneously in East sector. Is anyone else facing blackout? Checking if this is routine maintenance or unexpected grid failure.",
    time: "2026-10-14 14:35:00",
    timestamp: 1792055100000,
    location: "Mumbai",
    hashtags: ["#PowerOutage", "#GridAlert", "#MumbaiBlackout"],
    media_type: "reel",
    video_placeholder: "Flickering City Skyline at Dusk",
    verified: false
  },

  // 14. Work-from-Home Scam Indicator - HIGH RISK
  {
    post_id: "POST-114",
    account_id: "user_910",
    account_age_days: 3,
    posts_last_hour: 19,
    post_text: "Earn 5,000 to 10,000 Daily from home! Simple YouTube video liking task. No qualification needed. Send Rs 500 registration deposit on Telegram to get started. Visit: https://example.invalid/easy-earning",
    time: "2026-10-14 14:38:00",
    timestamp: 1792055280000,
    location: "Kolkata",
    hashtags: ["#WorkFromHome", "#DailyIncome", "#PartTimeJob", "#EarnOnline"],
    media_type: "reel",
    video_placeholder: "Counting Cash Notes Reel Clip",
    verified: false
  },

  // 15. Emerging Topic Second Report - MEDIUM RISK (Power Outage Surge)
  {
    post_id: "POST-115",
    account_id: "user_778",
    account_age_days: 85,
    posts_last_hour: 2,
    post_text: "Traffic signals are completely dark near Thane flyover due to #PowerOutage. Grid backup hasn't kicked in yet. Drive cautiously everyone!",
    time: "2026-10-14 14:37:00",
    timestamp: 1792055220000,
    location: "Mumbai",
    hashtags: ["#PowerOutage", "#TrafficAlert", "#MumbaiBlackout"],
    media_type: "reel",
    video_placeholder: "Traffic Police Directing Cars in Low Light",
    verified: false
  }
];

// Baseline frequencies for emerging topic detection
const TOPIC_BASELINES = {
  "#PowerOutage": 1,
  "#BoycottMetro": 1,
  "#BankCrisis": 2,
  "#CyberSafety": 8,
  "#Hackathon2026": 12,
  "#ElectricityBill": 3,
  "#Weather": 15
};

// Default initial state export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_POSTS, TOPIC_BASELINES };
}
