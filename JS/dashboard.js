/**
 * dashboard.js - SOC Threat Intelligence Dashboard Logic
 * Handles KPIs, Chart.js visualizations, filtering, alert management & CSV export.
 */

// Application State
let appPosts = [];
let reviewerDecisions = {};
let riskDonutChart = null;
let timelineLineChart = null;

// Filter state
let currentFilters = {
  riskLevel: 'ALL',
  category: 'ALL',
  searchQuery: ''
};

// Initialize Dashboard
function initDashboard() {
  loadStoredData();
  recalculateAllAnalyses();
  renderKPIs();
  initCharts();
  renderTopicTrends();
  renderGeoIntelligence();
  renderAlertList();
  setupFilterListeners();
  startLiveWatcherSync();
}

// Live Real-Time Sync with Python Watchdog Engine
function startLiveWatcherSync() {
  setInterval(() => {
    fetch('http://127.0.0.1:8765/api/threats')
      .then(res => res.json())
      .then(data => {
        if (data && data.live_events && data.live_events.length > 0) {
          let updated = false;
          data.live_events.forEach(evt => {
            if (!appPosts.some(p => p.id === evt.id)) {
              appPosts.unshift(evt);
              updated = true;
            }
          });
          if (data.reviews) {
            reviewerDecisions = Object.assign({}, reviewerDecisions, data.reviews);
            updated = true;
          }
          if (updated) {
            renderKPIs();
            renderAlertList();
          }
        }
      })
      .catch(() => {});
  }, 1500);
}

// Load data from localStorage or default dataset
function loadStoredData() {
  try {
    const savedPosts = localStorage.getItem('social_sentinel_posts');
    if (savedPosts) {
      appPosts = JSON.parse(savedPosts);
    } else {
      appPosts = JSON.parse(JSON.stringify(SAMPLE_POSTS));
      localStorage.setItem('social_sentinel_posts', JSON.stringify(appPosts));
    }

    const savedReviews = localStorage.getItem('social_sentinel_reviews');
    if (savedReviews) {
      reviewerDecisions = JSON.parse(savedReviews);
    }
  } catch (e) {
    console.warn("Storage access fallback:", e);
    appPosts = JSON.parse(JSON.stringify(SAMPLE_POSTS));
  }
}

// Save back to localStorage
function persistData() {
  try {
    localStorage.setItem('social_sentinel_posts', JSON.stringify(appPosts));
    localStorage.setItem('social_sentinel_reviews', JSON.stringify(reviewerDecisions));
  } catch (e) {
    console.warn("Failed persisting to localStorage:", e);
  }
}

// Run engine on all posts
function recalculateAllAnalyses() {
  appPosts.forEach(post => {
    post.analysis = analyzeThreat(post, appPosts, TOPIC_BASELINES);
  });
}

// 1. Render Top KPI Counters
function renderKPIs() {
  const total = appPosts.length;
  let high = 0;
  let med = 0;
  let low = 0;
  let pendingReviews = 0;

  appPosts.forEach(p => {
    const lvl = p.analysis.level;
    if (lvl === 'HIGH') high++;
    else if (lvl === 'MEDIUM') med++;
    else low++;

    if ((lvl === 'HIGH' || lvl === 'MEDIUM') && !reviewerDecisions[p.post_id]) {
      pendingReviews++;
    }
  });

  const elTotal = document.getElementById('kpiTotal') || document.getElementById('kpiTotalCount');
  const elHigh = document.getElementById('kpiHigh') || document.getElementById('kpiHighCount');
  const elMed = document.getElementById('kpiMed') || document.getElementById('kpiMedCount');
  const elReviewed = document.getElementById('kpiReviewed') || document.getElementById('kpiPendingReviews');

  if (elTotal) elTotal.innerText = total;
  if (elHigh) elHigh.innerText = high;
  if (elMed) elMed.innerText = med;
  if (elReviewed) elReviewed.innerText = Object.keys(reviewerDecisions || {}).length;
}

// 2. Initialize Chart.js visual graphs
function initCharts() {
  const riskCtx = document.getElementById('riskDistributionChart');
  const timeCtx = document.getElementById('activityTimelineChart');

  if (!riskCtx || !timeCtx) return;

  // Calculate counts for Doughnut chart
  let high = 0, med = 0, low = 0;
  appPosts.forEach(p => {
    if (p.analysis.level === 'HIGH') high++;
    else if (p.analysis.level === 'MEDIUM') med++;
    else low++;
  });

  // Risk Donut Chart
  if (riskDonutChart) riskDonutChart.destroy();
  riskDonutChart = new Chart(riskCtx, {
    type: 'doughnut',
    data: {
      labels: ['High Risk (70-100)', 'Medium Risk (40-69)', 'Low / Benign (0-39)'],
      datasets: [{
        data: [high, med, low],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderWidth: 2,
        borderColor: '#162032',
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12 }
        }
      },
      cutout: '68%'
    }
  });

  // Group posts by time window for Timeline Chart
  const timeBuckets = { "09:00": 0, "11:00": 0, "13:00": 0, "14:00": 0, "14:30": 0 };
  const threatBuckets = { "09:00": 0, "11:00": 0, "13:00": 0, "14:00": 0, "14:30": 0 };

  appPosts.forEach(p => {
    const t = p.time ? p.time.substring(11, 16) : "14:00";
    let key = "14:00";
    if (t < "10:00") key = "09:00";
    else if (t < "12:00") key = "11:00";
    else if (t < "13:30") key = "13:00";
    else if (t < "14:20") key = "14:00";
    else key = "14:30";

    timeBuckets[key] = (timeBuckets[key] || 0) + 1;
    if (p.analysis.level === 'HIGH' || p.analysis.level === 'MEDIUM') {
      threatBuckets[key] = (threatBuckets[key] || 0) + 1;
    }
  });

  // Activity Timeline Chart
  if (timelineLineChart) timelineLineChart.destroy();
  timelineLineChart = new Chart(timeCtx, {
    type: 'line',
    data: {
      labels: Object.keys(timeBuckets),
      datasets: [
        {
          label: 'Total Posts Analyzed',
          data: Object.values(timeBuckets),
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#06b6d4'
        },
        {
          label: 'Flagged Threats (Med/High)',
          data: Object.values(threatBuckets),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#ef4444'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12 }
        }
      },
      scales: {
        x: {
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { size: 10 } }
        },
        y: {
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { size: 10 }, stepSize: 2 },
          beginAtZero: true
        }
      }
    }
  });
}

// 3. Render Emerging Topics & Surge Hashtags
function renderTopicTrends() {
  const container = document.getElementById('trendingTopicsContainer');
  if (!container) return;

  const tagCounts = {};
  appPosts.forEach(p => {
    (p.hashtags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  let html = '';
  sortedTags.forEach(([tag, count]) => {
    const baseline = TOPIC_BASELINES[tag] || 2;
    const isSurge = count / baseline >= 2.5 && count >= 3;
    html += `
      <div class="topic-pill ${isSurge ? 'surge' : ''}" title="${isSurge ? 'High activity anomaly detected!' : 'Normal volume'}">
        <span>${isSurge ? '🔥 ' : '# '}${tag}</span>
        <span class="count-badge">${count} posts ${isSurge ? `(${Math.round(count / baseline)}x surge)` : ''}</span>
      </div>
    `;
  });

  container.innerHTML = html || '<p style="color:#64748b; font-size:12px;">No topic tags available.</p>';
}

// 4. Render Geographic Threat Distribution
function renderGeoIntelligence() {
  const container = document.getElementById('geoIntelligenceContainer');
  if (!container) return;

  const cityThreats = {};
  appPosts.forEach(p => {
    const loc = p.location || 'Unknown / Not Provided';
    if (!cityThreats[loc]) cityThreats[loc] = { total: 0, threats: 0 };
    cityThreats[loc].total++;
    if (p.analysis.level === 'HIGH' || p.analysis.level === 'MEDIUM') {
      cityThreats[loc].threats++;
    }
  });

  const sortedCities = Object.entries(cityThreats).sort((a, b) => b[1].threats - a[1].threats);
  const maxThreat = Math.max(...sortedCities.map(c => c[1].threats), 1);

  let html = '';
  sortedCities.forEach(([city, stat]) => {
    const pct = Math.round((stat.threats / maxThreat) * 100);
    html += `
      <div class="geo-row">
        <div class="geo-city">
          <span>📍 ${city}</span>
        </div>
        <div class="geo-bar-wrapper">
          <div class="geo-bar" style="width: ${pct}%;"></div>
        </div>
        <div style="font-size: 11px; color: ${stat.threats > 0 ? '#f87171' : '#34d399'}; font-weight:700;">
          ${stat.threats} threats / ${stat.total} posts
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 5. Render Filterable Alert List & Human Review Flow
function renderAlertList() {
  const container = document.getElementById('alertsContainer');
  if (!container) return;

  const filtered = appPosts.filter(post => {
    // Risk Level filter
    if (currentFilters.riskLevel !== 'ALL' && post.analysis.level !== currentFilters.riskLevel) {
      return false;
    }
    // Category filter
    if (currentFilters.category !== 'ALL') {
      const cat = post.analysis.category.toLowerCase();
      const target = currentFilters.category.toLowerCase();
      if (!cat.includes(target)) return false;
    }
    // Search filter
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery.toLowerCase();
      const matchText = (post.post_text || '').toLowerCase().includes(q);
      const matchUser = (post.account_id || '').toLowerCase().includes(q);
      const matchLoc = (post.location || '').toLowerCase().includes(q);
      const matchTags = (post.hashtags || []).some(t => t.toLowerCase().includes(q));
      if (!matchText && !matchUser && !matchLoc && !matchTags) return false;
    }
    return true;
  });

  document.getElementById('filteredAlertsCount').innerText = `${filtered.length} of ${appPosts.length} posts`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #64748b; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <p style="font-size: 15px; margin-bottom: 6px;">🔍 No items match the selected filters.</p>
        <p style="font-size: 12px;">Try selecting "All Risk Levels" or clearing the keyword search.</p>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(post => {
    const an = post.analysis;
    const review = reviewerDecisions[post.post_id];
    const isInvestigating = review && review.status === 'Needs Investigation';
    const isDismissed = review && review.status === 'Not Concerning';

    const reasonsListHtml = an.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('');

    html += `
      <div class="alert-card-item ${an.level.toLowerCase()}" id="alert-card-${post.post_id}">
        <div class="alert-header-row">
          <div>
            <div class="alert-author">
              <span>👤 @${escapeHtml(post.account_id)}</span>
              ${post.verified ? '<span title="Verified Source" style="color:#38bdf8;">✓</span>' : ''}
              <span class="alert-meta-time">• ${escapeHtml(post.time || 'Recent')} • 📍 ${escapeHtml(post.location || 'Unknown')}</span>
            </div>
            <div style="margin-top: 4px;">
              <span class="alert-category-tag">${escapeHtml(an.category)}</span>
              ${post.hashtags ? post.hashtags.map(t => `<span style="font-size:11px; color:#64748b; margin-right:4px;">${escapeHtml(t)}</span>`).join('') : ''}
            </div>
          </div>
          <div style="text-align: right;">
            <span class="badge badge-${an.level.toLowerCase()}">${an.level} RISK (${an.score}/100)</span>
          </div>
        </div>

        <div class="alert-post-body">
          "${escapeHtml(post.post_text)}"
        </div>

        <div class="alert-reasons-box">
          <div class="reasons-title">
            <span>🛡️ Why This Was Flagged (Explainable Detection):</span>
          </div>
          <ul class="reasons-list">
            ${reasonsListHtml}
          </ul>
        </div>

        <div class="suggested-action-box">
          <span>💡 <b>Recommended Next Step for Reviewer:</b> ${escapeHtml(an.suggestedAction)}</span>
        </div>

        <div class="ethical-note">
          ⚠️ ${escapeHtml(an.disclaimer)}
        </div>

        <div class="review-action-row">
          <div class="review-state-label">
            <b>Review Status:</b> 
            ${review 
              ? `<span style="color:${isInvestigating ? '#ef4444' : '#10b981'}; font-weight:700;">${review.status}</span> <small style="color:#64748b;">(${review.timestamp})</small>`
              : '<span style="color:#f59e0b; font-weight:600;">⏳ Pending Review</span>'}
          </div>
          <div class="review-btns">
            <button class="btn-review ${isInvestigating ? 'active-investigate' : ''}" onclick="submitReview('${post.post_id}', 'Needs Investigation')">
              🚩 Needs Investigation
            </button>
            <button class="btn-review ${isDismissed ? 'active-dismiss' : ''}" onclick="submitReview('${post.post_id}', 'Not Concerning')">
              ✅ Not Concerning
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Handle human reviewer feedback
function submitReview(postId, decisionStatus) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  reviewerDecisions[postId] = {
    status: decisionStatus,
    timestamp: now
  };

  persistData();
  renderKPIs();
  renderAlertList();
}

// 6. Setup Filter Event Listeners
function setupFilterListeners() {
  const riskSelect = document.getElementById('riskFilterSelect');
  const catSelect = document.getElementById('categoryFilterSelect');
  const searchInput = document.getElementById('searchQueryInput');

  if (riskSelect) {
    riskSelect.addEventListener('change', (e) => {
      currentFilters.riskLevel = e.target.value;
      renderAlertList();
    });
  }

  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
      renderAlertList();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.searchQuery = e.target.value;
      renderAlertList();
    });
  }
}

// 7. CSV Export Functionality
function exportAlertsToCSV() {
  if (!appPosts || appPosts.length === 0) {
    alert("No posts available to export.");
    return;
  }

  const headers = [
    "Post ID",
    "Account ID",
    "Location",
    "Timestamp",
    "Risk Score",
    "Risk Level",
    "Primary Category",
    "Detection Reasons",
    "Suggested Action",
    "Human Review Status",
    "Post Caption"
  ];

  const csvRows = [headers.join(",")];

  appPosts.forEach(post => {
    const an = post.analysis;
    const review = reviewerDecisions[post.post_id];
    const reviewStatus = review ? review.status : "Pending Review";
    const cleanReasons = (an.reasons || []).join(" | ").replace(/"/g, '""');
    const cleanCaption = (post.post_text || "").replace(/"/g, '""');
    const cleanAction = (an.suggestedAction || "").replace(/"/g, '""');

    const row = [
      `"${post.post_id}"`,
      `"${post.account_id}"`,
      `"${post.location || ''}"`,
      `"${post.time || ''}"`,
      an.score,
      `"${an.level}"`,
      `"${an.category}"`,
      `"${cleanReasons}"`,
      `"${cleanAction}"`,
      `"${reviewStatus}"`,
      `"${cleanCaption}"`
    ];

    csvRows.push(row.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Threat_Monitor_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Utility: HTML Escaping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Reset sample data button
function resetDemoData() {
  if (confirm("Reset all posts and review statuses back to default demo state?")) {
    localStorage.removeItem('social_sentinel_posts');
    localStorage.removeItem('social_sentinel_reviews');
    reviewerDecisions = {};
    appPosts = JSON.parse(JSON.stringify(SAMPLE_POSTS));
    recalculateAllAnalyses();
    renderKPIs();
    initCharts();
    renderTopicTrends();
    renderGeoIntelligence();
    renderAlertList();
    if (typeof renderReelsFeed === 'function') {
      renderReelsFeed();
    }
    alert("Demo data successfully reset.");
  }
}
