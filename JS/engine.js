/**
 * engine.js - Central Risk-Scoring & Decision Aggregator
 * Combines outputs from all 5 detectors into an explainable threat profile.
 */

function analyzeThreat(post, allPosts = [], baselines = {}) {
  const text = (post.post_text || "").toLowerCase();

  // Run all 5 modular detectors
  const cyber = detectCybercrime(post, text);
  const misinfo = detectMisinformation(post, text);
  const coord = detectCoordinatedActivity(post, allPosts);
  const surge = detectEmergingTopics(post, allPosts, baselines);
  const tension = detectSocialTension(post, text);

  const detectorResults = [cyber, misinfo, coord, surge, tension];

  // Sort by highest score
  detectorResults.sort((a, b) => b.score - a.score);
  const primaryThreat = detectorResults[0];

  // Overall score is determined primarily by the highest threat detector
  // With small compound factor if multiple categories are flagged
  let overallScore = primaryThreat.score;
  const secondaryThreats = detectorResults.slice(1).filter(d => d.score >= 35);
  if (secondaryThreats.length > 0 && overallScore < 95) {
    overallScore = Math.min(100, overallScore + 5 * secondaryThreats.length);
  }

  // Risk Level Classification (as per specifications)
  let level = "LOW";
  let badgeColor = "#22c55e"; // Green
  if (overallScore >= 70) {
    level = "HIGH";
    badgeColor = "#ef4444"; // Red
  } else if (overallScore >= 40) {
    level = "MEDIUM";
    badgeColor = "#f59e0b"; // Amber / Orange
  }

  // Determine category label
  let category = "Normal / Low Risk Activity";
  if (overallScore >= 40) {
    category = primaryThreat.category;
  }

  // Aggregate explainable reasons
  let allReasons = [...primaryThreat.reasons];
  secondaryThreats.forEach(sec => {
    sec.reasons.forEach(r => {
      if (!allReasons.includes(r)) {
        allReasons.push(`[${sec.category}] ${r}`);
      }
    });
  });

  if (allReasons.length === 0) {
    allReasons.push("Normal benign social interaction; no high-risk indicators identified.");
  }

  // Context-aware Suggested Next Step for Human Reviewer
  let suggestedAction = "No immediate intervention required. Continue routine monitoring.";
  if (level === "HIGH") {
    if (category.includes("Cybercrime")) {
      suggestedAction = "Quarantine post, verify destination link against threat registry, and submit safe report to CERT-In / cyber portal.";
    } else if (category.includes("Misinformation")) {
      suggestedAction = "Cross-check claim with verified PIB / official press releases and attach factual context disclaimer.";
    } else if (category.includes("Coordinated")) {
      suggestedAction = "Cluster detected: Trace linked puppet accounts for automated syndicate behavior and throttle rate limit.";
    } else if (category.includes("Social Tension")) {
      suggestedAction = "High-priority alert: Escalate content to trust & safety desk for ground verification with local authorities.";
    }
  } else if (level === "MEDIUM") {
    if (category.includes("Emerging")) {
      suggestedAction = "Monitor hashtag frequency trend over next 60 minutes for potential viral escalation.";
    } else {
      suggestedAction = "Flag for manual reviewer queue; evaluate community feedback and account history.";
    }
  }

  return {
    post_id: post.post_id,
    score: overallScore,
    level: level,
    badgeColor: badgeColor,
    category: category,
    reasons: allReasons,
    suggestedAction: suggestedAction,
    disclaimer: "Ethical Note: This score is a heuristic early indicator generated to assist human analysts. It is not conclusive proof of wrongdoing.",
    breakdown: {
      cybercrime: cyber.score,
      misinformation: misinfo.score,
      coordination: coord.score,
      topicSurge: surge.score,
      socialTension: tension.score
    }
  };
}

// Batch analysis function
function evaluateAllPosts(posts, baselines = {}) {
  return posts.map(post => {
    const analysis = analyzeThreat(post, posts, baselines);
    return {
      ...post,
      analysis: analysis
    };
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { analyzeThreat, evaluateAllPosts };
}
