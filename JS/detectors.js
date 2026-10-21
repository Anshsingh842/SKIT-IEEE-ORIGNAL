/**
 * detectors.js - Explainable Detection Modules
 * Contains 5 independent, rule-based detection functions.
 * Designed modularly so machine-learning models can be plugged in later.
 */

// 1. CYBERCRIME & SCAM DETECTOR
function detectCybercrime(post, text) {
  let score = 0;
  let reasons = [];
  let matchedPatterns = [];

  // Critical credential / remote access keywords
  const credentialPatterns = [
    { term: "otp", weight: 35, desc: "OTP request" },
    { term: "pin", weight: 35, desc: "PIN request" },
    { term: "cvv", weight: 40, desc: "Card CVV request" },
    { term: "aadhaar", weight: 25, desc: "Aadhaar / ID copy solicitation" },
    { term: "anydesk", weight: 40, desc: "Remote desktop tool (AnyDesk)" },
    { term: "teamviewer", weight: 40, desc: "Remote tool (TeamViewer)" },
    { term: "send password", weight: 45, desc: "Direct password request" }
  ];

  // Financial lure / scam terminology
  const lurePatterns = [
    { term: "lottery", weight: 25, desc: "Lottery / Lucky draw lure" },
    { term: "lucky draw", weight: 25, desc: "Lucky draw inducement" },
    { term: "won 25 lakh", weight: 35, desc: "High cash prize promise" },
    { term: "free money", weight: 25, desc: "Free money lure" },
    { term: "double money", weight: 35, desc: "Guaranteed high returns promise" },
    { term: "registration deposit", weight: 35, desc: "Advance fee / registration deposit" },
    { term: "earn 5,000", weight: 30, desc: "Work-from-home task scam lure" },
    { term: "liking task", weight: 30, desc: "Social media task scam pattern" }
  ];

  // Urgency & Fear tactics
  const urgencyPatterns = [
    { term: "disconnected tonight", weight: 30, desc: "Service disconnection threat" },
    { term: "account band", weight: 25, desc: "Threat of account suspension" },
    { term: "sim block", weight: 25, desc: "SIM block intimidation" },
    { term: "pay rs 10", weight: 25, desc: "Micro-payment phishing lure" },
    { term: "immediately pay", weight: 25, desc: "Artificial urgency" }
  ];

  // Safe mitigating keywords (Cyber awareness advisories)
  const safeMitigators = [
    { term: "never ask for otp", mitigation: 50, desc: "Educational advisory on OTP" },
    { term: "never ask", mitigation: 40, desc: "Cautionary warning language" },
    { term: "safety advisory", mitigation: 45, desc: "Official safety alert" },
    { term: "stay alert", mitigation: 25, desc: "Awareness reminder" },
    { term: "cyber cell", mitigation: 30, desc: "Institutional cyber defense reference" },
    { term: "official portals", mitigation: 25, desc: "Legitimate verification direction" }
  ];

  let hasCredentials = false;
  let hasLure = false;
  let hasUrgency = false;

  credentialPatterns.forEach(p => {
    if (text.includes(p.term)) {
      score += p.weight;
      hasCredentials = true;
      reasons.push(p.desc);
      matchedPatterns.push(p.term);
    }
  });

  lurePatterns.forEach(p => {
    if (text.includes(p.term)) {
      score += p.weight;
      hasLure = true;
      reasons.push(p.desc);
      matchedPatterns.push(p.term);
    }
  });

  urgencyPatterns.forEach(p => {
    if (text.includes(p.term)) {
      score += p.weight;
      hasUrgency = true;
      reasons.push(p.desc);
      matchedPatterns.push(p.term);
    }
  });

  // Check for external link
  if (text.includes("http://") || text.includes("https://")) {
    score += 15;
    reasons.push("Contains external link for credential capture or payment");
  }

  // Apply mitigators (Awareness posts shouldn't be penalized)
  safeMitigators.forEach(m => {
    if (text.includes(m.term)) {
      score -= m.mitigation;
      reasons.push(`Mitigating context: "${m.desc}"`);
    }
  });

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return {
    category: "Cybercrime & Scam Indicators",
    score,
    reasons,
    matchedPatterns
  };
}


// 2. MISINFORMATION & UNVERIFIED CLAIMS DETECTOR
function detectMisinformation(post, text) {
  let score = 0;
  let reasons = [];
  let matchedPatterns = [];

  const misinfoFlags = [
    { term: "100% verified secret leak", weight: 45, desc: "Extreme unsupported certainty claim" },
    { term: "100% verified", weight: 30, desc: "Unsubstantiated absolute certainty" },
    { term: "mainstream media is hiding", weight: 35, desc: "Conspiracy rhetoric delegitimizing public sources" },
    { term: "media won't show you", weight: 35, desc: "Sensationalist media suppression claim" },
    { term: "secret leak", weight: 25, desc: "Anonymous unverifiable leak assertion" },
    { term: "banks have collapsed", weight: 35, desc: "Panic-inducing systemic financial rumor" },
    { term: "withdraw all your savings", weight: 40, desc: "Call to bank-run panic" },
    { term: "miracle cure", weight: 35, desc: "Unverified medical panacea" },
    { term: "cures 100% viral fever", weight: 40, desc: "Dangerous unverified medical claim" },
    { term: "fever remedy", weight: 25, desc: "Unverified viral medical remedy claim" },
    { term: "doctors won't tell you", weight: 30, desc: "Anti-institutional health conspiracy pattern" },
    { term: "forward to everyone", weight: 20, desc: "Viral chain-sharing solicitation" }
  ];

  misinfoFlags.forEach(p => {
    if (text.includes(p.term)) {
      score += p.weight;
      reasons.push(p.desc);
      matchedPatterns.push(p.term);
    }
  });

  // Note for explainability:
  if (score >= 40) {
    reasons.push("Note: System flags claim patterns that warrant human verification; not verified ground falsehood.");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    category: "Misinformation & Unverified Claims",
    score,
    reasons,
    matchedPatterns
  };
}


// 3. COORDINATED ACTIVITY & BOT DETECTOR
function detectCoordinatedActivity(post, allPosts) {
  let score = 0;
  let reasons = [];
  let matchedPatterns = [];

  // Account level signals
  if (post.account_age_days !== undefined && post.account_age_days <= 3) {
    score += 25;
    reasons.push(`Fresh account (${post.account_age_days} day(s) old)`);
    matchedPatterns.push("fresh_account");
  }

  if (post.posts_last_hour !== undefined && post.posts_last_hour >= 15) {
    score += 30;
    reasons.push(`High posting velocity (${post.posts_last_hour} posts/hr - automated behavior indicator)`);
    matchedPatterns.push("high_velocity");
  }

  // Cross-account duplicate message detection
  if (allPosts && allPosts.length > 0) {
    const normalizedTarget = (post.post_text || "").trim().toLowerCase();
    const duplicates = allPosts.filter(other => {
      if (other.post_id === post.post_id) return false;
      const otherText = (other.post_text || "").trim().toLowerCase();
      return otherText === normalizedTarget;
    });

    if (duplicates.length > 0) {
      score += 45;
      const dupAccounts = duplicates.map(d => d.account_id).join(", ");
      reasons.push(`Identical text copy-pasted across ${duplicates.length} other account(s): [${dupAccounts}]`);
      matchedPatterns.push("duplicate_text_cluster");
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    category: "Coordinated Activity & Bot Behavior",
    score,
    reasons,
    matchedPatterns
  };
}


// 4. EMERGING TOPIC & UNUSUAL ACTIVITY DETECTOR
function detectEmergingTopics(post, allPosts, baselines = {}) {
  let score = 0;
  let reasons = [];
  let matchedPatterns = [];

  const hashtags = post.hashtags || [];
  
  hashtags.forEach(tag => {
    // Count occurrences of this tag in current dataset
    const countInDataset = (allPosts || []).filter(p => (p.hashtags || []).includes(tag)).length;
    const baseline = baselines[tag] || 1; // default baseline

    const ratio = countInDataset / baseline;

    if (ratio >= 2.0 && countInDataset >= 2) {
      score = Math.max(score, 55);
      reasons.push(`Topic surge on ${tag}: ${countInDataset} posts observed vs baseline of ${baseline} (${ratio.toFixed(1)}x spike)`);
      matchedPatterns.push(tag);
    }
  });

  score = Math.min(65, score); // Cap topic surge at 65 (Medium risk tier) unless combined with other threats

  return {
    category: "Emerging Topic & Activity Spike",
    score,
    reasons,
    matchedPatterns
  };
}


// 5. SOCIAL TENSION & INCITEMENT DETECTOR
// Strict ethical guardrail: Never targets people based on religion, caste, ethnicity, or community identity.
// Evaluates ONLY physical violence, weapons, riot calls, or intimidation.
function detectSocialTension(post, text) {
  let score = 0;
  let reasons = [];
  let matchedPatterns = [];

  const tensionKeywords = [
    { term: "aag laga do", weight: 45, desc: "Arson / Property burning incitement" },
    { term: "badla lenge", weight: 35, desc: "Retaliatory threat / Revenge call" },
    { term: "sabak sikhao", weight: 35, desc: "Vigilante call to teach lesson" },
    { term: "sticks and stones", weight: 40, desc: "Call to assemble with weapons/projectiles" },
    { term: "sadak par aao", weight: 25, desc: "Mass road mobilization / confrontation call" },
    { term: "block all national highways", weight: 30, desc: "Critical infrastructure blockage threat" },
    { term: "riot", weight: 40, desc: "Riot provocation language" },
    { term: "hinsa", weight: 35, desc: "Explicit violence invocation" }
  ];

  tensionKeywords.forEach(p => {
    if (text.includes(p.term)) {
      score += p.weight;
      reasons.push(p.desc);
      matchedPatterns.push(p.term);
    }
  });

  if (score >= 40) {
    reasons.push("Ethical Guardrail Notice: Flag based strictly on public safety & incitement language, not identity or belief.");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    category: "Emerging Social Tension & Incitement",
    score,
    reasons,
    matchedPatterns
  };
}

// Module export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    detectCybercrime,
    detectMisinformation,
    detectCoordinatedActivity,
    detectEmergingTopics,
    detectSocialTension
  };
}
