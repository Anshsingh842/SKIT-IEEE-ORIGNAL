/**
 * feed.js - Instagram/Reels Vertical Feed Simulator & Interactive Test Sandbox
 * Features:
 * - Vertical snap-scroll reel cards
 * - Real-time risk detection overlay with "Review Post", "Skip", and "Continue" actions
 * - Interactive test form to inject live custom posts/reels and watch detection happen in real time
 */

let reelObserver = null;

// Initialize Feed
function initFeed() {
  renderReelsFeed();
  setupPostCreationForm();
}

// 1. Render all Reels in the Mobile Simulator
function renderReelsFeed() {
  const container = document.getElementById('reelsScrollArea');
  if (!container) return;

  container.innerHTML = '';

  appPosts.forEach((post, index) => {
    const an = post.analysis || analyzeThreat(post, appPosts, TOPIC_BASELINES);
    const isThreat = an.level === 'HIGH' || an.level === 'MEDIUM';

    const card = document.createElement('div');
    card.className = 'reel-item';
    card.id = `reel-card-${post.post_id}`;
    card.dataset.postId = post.post_id;
    card.dataset.level = an.level;

    // Visual animation or icon depending on category
    let categoryIcon = "🎬";
    if (an.category.includes("Cybercrime")) categoryIcon = "💳";
    else if (an.category.includes("Misinformation")) categoryIcon = "📢";
    else if (an.category.includes("Coordinated")) categoryIcon = "🤖";
    else if (an.category.includes("Social Tension")) categoryIcon = "⚠️";
    else if (an.category.includes("Emerging")) categoryIcon = "⚡";

    card.innerHTML = `
      <!-- Video Backdrop Placeholder -->
      <div class="reel-video-backdrop">
        <div class="reel-video-icon">${categoryIcon}</div>
        <div style="font-weight:700; font-size:14px; color:#f1f5f9; margin-bottom:4px;">
          ${escapeHtml(post.video_placeholder || 'Simulated Reel Video Content')}
        </div>
        <div style="font-size:11px; color:#64748b;">
          Interactive Demo Reel • ID: ${post.post_id}
        </div>
      </div>

      <!-- Live Threat Warning Overlay (for Medium & High Risk posts) -->
      ${isThreat ? `
        <div class="threat-warning-overlay" id="reel-warning-${post.post_id}">
          <div class="warning-card ${an.level === 'MEDIUM' ? 'medium-risk' : ''}">
            <div class="warning-icon">${an.level === 'HIGH' ? '🚨' : '⚠️'}</div>
            <div class="warning-headline">
              POTENTIAL ${an.level} THREAT DETECTED
            </div>
            <div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">
              AI Risk Score: <b style="color:${an.badgeColor};">${an.score}/100</b> • ${escapeHtml(an.category)}
            </div>
            <div class="warning-explanation">
              <b>Flagged Triggers:</b><br>
              ${an.reasons.slice(0, 2).map(r => `• ${escapeHtml(r)}`).join('<br>')}
            </div>
            <div class="warning-actions">
              <button class="btn-warning-action btn-review-post" onclick="openDetailModal('${post.post_id}')">
                🔍 Review Post & Evidence
              </button>
              <button class="btn-warning-action btn-skip-post" onclick="skipReel('${post.post_id}')">
                ⏭️ Skip Post
              </button>
              <button class="btn-warning-action btn-continue-viewing" onclick="dismissWarning('${post.post_id}')">
                Continue Watching Anyway
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Bottom Meta Overlay -->
      <div class="reel-overlay-content">
        <div class="reel-author-tag">
          <span class="reel-username">@${escapeHtml(post.account_id)}</span>
          <span class="badge badge-${an.level.toLowerCase()}">${an.level} (${an.score})</span>
        </div>
        <div class="reel-caption-text">
          ${escapeHtml(post.post_text)}
        </div>
        <div class="reel-hashtags">
          ${(post.hashtags || []).map(t => escapeHtml(t)).join(' ')}
        </div>
        <div style="font-size:10px; color:#64748b; display:flex; justify-content:space-between;">
          <span>📍 ${escapeHtml(post.location || 'India')} • ${escapeHtml(post.time || 'Recent')}</span>
          <span style="color:#06b6d4; cursor:pointer;" onclick="openDetailModal('${post.post_id}')">Inspect Intel ℹ️</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  setupReelIntersectionObserver();
}

// 2. Setup Intersection Observer to trigger warnings when scrolling
function setupReelIntersectionObserver() {
  if (reelObserver) reelObserver.disconnect();

  const container = document.getElementById('reelsScrollArea');
  if (!container) return;

  reelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const postId = card.dataset.postId;
        const level = card.dataset.level;

        if (level === 'HIGH' || level === 'MEDIUM') {
          const warningEl = document.getElementById(`reel-warning-${postId}`);
          if (warningEl && warningEl.dataset.dismissed !== 'true') {
            warningEl.style.display = 'flex';
          }
        }
      }
    });
  }, {
    root: container,
    threshold: 0.65
  });

  document.querySelectorAll('.reel-item').forEach(item => {
    reelObserver.observe(item);
  });
}

// Actions from Reel Warning Overlay
function skipReel(postId) {
  const currentCard = document.getElementById(`reel-card-${postId}`);
  if (currentCard && currentCard.nextElementSibling) {
    currentCard.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("You have reached the end of the demo feed.");
  }
}

function dismissWarning(postId) {
  const warningEl = document.getElementById(`reel-warning-${postId}`);
  if (warningEl) {
    warningEl.style.display = 'none';
    warningEl.dataset.dismissed = 'true';
  }
}

// 3. Open Detailed Intel Modal
function openDetailModal(postId) {
  const post = appPosts.find(p => p.post_id === postId);
  if (!post) return;

  const an = post.analysis || analyzeThreat(post, appPosts, TOPIC_BASELINES);
  const modal = document.getElementById('intelDetailModal');
  const modalBody = document.getElementById('intelModalBody');

  if (!modal || !modalBody) return;

  const reasonsList = an.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('');

  modalBody.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div>
        <span style="font-weight:700; color:#38bdf8; font-size:15px;">@${escapeHtml(post.account_id)}</span>
        <span style="font-size:12px; color:#64748b;"> • ${escapeHtml(post.time || 'Recent')} • 📍 ${escapeHtml(post.location || 'Unknown')}</span>
      </div>
      <span class="badge badge-${an.level.toLowerCase()}" style="font-size:12px; padding:4px 10px;">
        ${an.level} RISK (${an.score}/100)
      </span>
    </div>

    <div style="background:#0f172a; border-left:3px solid #38bdf8; padding:12px; border-radius:6px; margin-bottom:16px; font-size:13px; line-height:1.5;">
      "${escapeHtml(post.post_text)}"
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:6px;">
        Category & Classification:
      </div>
      <span class="alert-category-tag" style="font-size:13px; padding:4px 10px;">${escapeHtml(an.category)}</span>
    </div>

    <div style="background:#0f172a; border:1px solid #1e293b; padding:12px; border-radius:6px; margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; color:#e2e8f0; margin-bottom:8px;">
        🛡️ Explainable Evidence & Triggers:
      </div>
      <ul style="padding-left:20px; font-size:12px; color:#cbd5e1; line-height:1.6;">
        ${reasonsList}
      </ul>
    </div>

    <div style="background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.3); padding:12px; border-radius:6px; margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; color:#93c5fd; margin-bottom:4px;">
        💡 Human Reviewer Next Steps:
      </div>
      <div style="font-size:12px; color:#bfdbfe;">
        ${escapeHtml(an.suggestedAction)}
      </div>
    </div>

    <div style="font-size:11px; color:#64748b; font-style:italic; border-top:1px solid #1e293b; padding-top:10px;">
      ⚠️ ${escapeHtml(an.disclaimer)}
    </div>
  `;

  modal.style.display = 'flex';
}

function closeDetailModal() {
  const modal = document.getElementById('intelDetailModal');
  if (modal) modal.style.display = 'none';
}

// 4. Test Sandbox: Submit custom post and analyze live
function setupPostCreationForm() {
  const btn = document.getElementById('btnSubmitTestPost');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const textInput = document.getElementById('testPostText');
    const locationInput = document.getElementById('testPostLocation');
    const tagsInput = document.getElementById('testPostTags');
    const resultBox = document.getElementById('testResultOutput');

    const text = (textInput ? textInput.value : '').trim();
    const location = (locationInput ? locationInput.value : '').trim() || 'Jaipur';
    const rawTags = (tagsInput ? tagsInput.value : '').trim();

    if (!text) {
      alert("Please enter a caption / message to analyze.");
      return;
    }

    const tags = rawTags ? rawTags.split(/\s+/).map(t => t.startsWith('#') ? t : `#${t}`) : ['#LiveTest'];

    // Create candidate post
    const newPost = {
      post_id: `POST-${Date.now().toString().slice(-4)}`,
      account_id: `user_${Math.floor(100 + Math.random() * 900)}`,
      account_age_days: 2,
      posts_last_hour: 5,
      post_text: text,
      time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      timestamp: Date.now(),
      location: location,
      hashtags: tags,
      media_type: 'reel',
      video_placeholder: `User Demo Reel (${location})`,
      verified: false
    };

    // Run real-time analysis
    const analysis = analyzeThreat(newPost, [newPost, ...appPosts], TOPIC_BASELINES);
    newPost.analysis = analysis;

    // Display test result summary in sandbox
    if (resultBox) {
      resultBox.style.display = 'block';
      let borderCol = '#10b981', bgCol = 'rgba(16,185,129,0.1)';
      if (analysis.level === 'HIGH') {
        borderCol = '#ef4444';
        bgCol = 'rgba(239,68,68,0.15)';
      } else if (analysis.level === 'MEDIUM') {
        borderCol = '#f59e0b';
        bgCol = 'rgba(245,158,11,0.15)';
      }

      resultBox.style.borderColor = borderCol;
      resultBox.style.background = bgCol;
      resultBox.innerHTML = `
        <div style="font-weight:800; color:${borderCol}; font-size:14px; margin-bottom:4px;">
          ${analysis.level} RISK DETECTED (${analysis.score}/100)
        </div>
        <div style="font-size:12px; color:#cbd5e1; margin-bottom:6px;">
          <b>Category:</b> ${escapeHtml(analysis.category)}
        </div>
        <div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">
          <b>Wajah (Triggers):</b> ${analysis.reasons.join(' • ')}
        </div>
        <div style="font-size:11px; color:#38bdf8;">
          ✓ Post successfully injected into Live Feed and SOC Dashboard!
        </div>
      `;
    }

    // Add to main state at top
    appPosts.unshift(newPost);
    persistData();

    // Re-render feed and dashboard
    renderReelsFeed();
    recalculateAllAnalyses();
    renderKPIs();
    initCharts();
    renderTopicTrends();
    renderGeoIntelligence();
    renderAlertList();

    // Clear form inputs
    if (textInput) textInput.value = '';
    if (tagsInput) tagsInput.value = '';
  });
}
