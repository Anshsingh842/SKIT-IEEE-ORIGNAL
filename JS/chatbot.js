/**
 * chatbot.js - Corner Floating "AI Chowkidaar" Assistant & Real-Time Reel Watchdog
 * Proactively alerts user on scam reels and provides interactive fraud analysis chat.
 */

let activeCurrentReel = null;
let bubbleTimeout = null;

// Initialize Chatbot Widget on Load
function initChowkidaarBot() {
  injectChatbotDOM();
  setupChatbotListeners();
  hookReelObserverForBot();

  // Welcome user right on the starting screen
  setTimeout(() => {
    const bubble = document.getElementById('chowkidaarBubble');
    const bubbleTitle = document.getElementById('chowkidaarBubbleTitle');
    const bubbleText = document.getElementById('chowkidaarBubbleText');
    if (bubble && bubbleTitle && bubbleText) {
      bubble.style.display = 'flex';
      bubbleTitle.className = 'chowkidaar-bubble-title safe';
      bubbleTitle.innerHTML = '🛡️ AI Chowkidaar Active!';
      bubbleText.innerHTML = 'Main starting screen par hi reels scan kar raha hoon. Niche scroll karein scam pakadne ke liye!';
      setTimeout(() => {
        if (bubble && !bubble.classList.contains('threat')) bubble.style.display = 'none';
      }, 7000);
    }
  }, 600);
}

// 1. Inject DOM elements into body
function injectChatbotDOM() {
  if (document.getElementById('chowkidaarLauncher')) return;

  const botContainer = document.createElement('div');
  botContainer.innerHTML = `
    <!-- Speech Bubble Alert Popup -->
    <div id="chowkidaarBubble" class="chowkidaar-bubble-alert" style="display:none; position:fixed; bottom:95px; right:25px; z-index:9998;" onclick="toggleChowkidaarChat(true)">
      <div id="chowkidaarBubbleTitle" class="chowkidaar-bubble-title threat">🛡️ AI Chowkidaar Alert</div>
      <div id="chowkidaarBubbleText" style="font-size:12px; color:#cbd5e1;">Scanning social feed in real time...</div>
    </div>

    <!-- Floating Circular Avatar Button (Bottom-Right) -->
    <div id="chowkidaarLauncher" class="chowkidaar-launcher" onclick="toggleChowkidaarChat()">
      <div class="chowkidaar-avatar-btn" id="chowkidaarAvatar">
        🛡️
        <div class="chowkidaar-status-dot" id="chowkidaarStatusDot"></div>
      </div>
    </div>

    <!-- The Slide-out Chat Window -->
    <div id="chowkidaarChatWindow" class="chowkidaar-chat-window">
      <!-- Header -->
      <div class="chowkidaar-chat-header">
        <div class="chowkidaar-chat-brand">
          <div class="chowkidaar-chat-icon">🛡️</div>
          <div>
            <div class="chowkidaar-chat-name">
              <span>AI Chowkidaar</span>
              <span style="font-size:10px; background:rgba(0,212,255,0.15); color:#00d4ff; padding:1px 5px; border-radius:3px;">Copilot</span>
            </div>
            <div class="chowkidaar-chat-sub">
              <span style="width:6px; height:6px; background:#10b981; border-radius:50%; display:inline-block;"></span>
              <span>Live Social Feed Watchdog</span>
            </div>
          </div>
        </div>
        <button class="chowkidaar-btn-close" onclick="toggleChowkidaarChat(false)">&times;</button>
      </div>

      <!-- Messages Area -->
      <div class="chowkidaar-chat-messages" id="chowkidaarMessages">
        <!-- Initial Bot Greeting -->
        <div class="msg-row bot">
          <div class="msg-bubble">
            👋 <b>Namaste! Main hoon aapka AI Chowkidaar.</b><br><br>
            Aap jab bhi reels scroll karenge, main har video aur caption ko real-time mein scan karke bataunga ki <b>scam hai ya safe</b>.<br><br>
            Aap mujhse kisi bhi post ke baare mein poochh sakte hain ya koi message yahan paste kar sakte hain!
          </div>
          <div class="msg-time">Just now</div>
        </div>
      </div>

      <!-- Quick Action Suggestion Chips -->
      <div class="chowkidaar-chips-wrapper">
        <button class="chip-btn" onclick="askQuickPrompt('scan_current')">🔍 Scan Current Reel</button>
        <button class="chip-btn" onclick="askQuickPrompt('why_scam')">❓ Yeh Scam Kyun Hai?</button>
        <button class="chip-btn" onclick="askQuickPrompt('safety_tips')">🛡️ Safety Tips</button>
        <button class="chip-btn" onclick="askQuickPrompt('report_fraud')">🚨 Fraud Report Kahan Karein?</button>
      </div>

      <!-- Input Bar -->
      <div class="chowkidaar-chat-input-bar">
        <input type="text" id="chowkidaarInput" class="chowkidaar-input" placeholder="Koi bhi message paste karein ya poochhein..." onkeypress="handleBotInputKey(event)">
        <button class="chowkidaar-btn-send" onclick="sendUserMessage()">➤</button>
      </div>
    </div>
  `;

  document.body.appendChild(botContainer);
}

// 2. Toggle Chat Window
function toggleChowkidaarChat(forceOpen = null) {
  const chatWin = document.getElementById('chowkidaarChatWindow');
  const bubble = document.getElementById('chowkidaarBubble');
  if (!chatWin) return;

  const isOpen = chatWin.classList.contains('open');
  const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;

  if (shouldOpen) {
    chatWin.classList.add('open');
    if (bubble) bubble.style.display = 'none'; // hide bubble when chat is opened
    // Focus input
    setTimeout(() => {
      const inp = document.getElementById('chowkidaarInput');
      if (inp) inp.focus();
    }, 100);
  } else {
    chatWin.classList.remove('open');
  }
}

// 3. Proactive Reel Watchdog Listener
// Hooks into the reel scrolling and triggers instant notifications
function notifyBotAboutReel(post) {
  activeCurrentReel = post;
  const analysis = (typeof analyzePost === 'function') ? analyzePost(post) : null;
  if (!analysis) return;

  const bubble = document.getElementById('chowkidaarBubble');
  const bubbleTitle = document.getElementById('chowkidaarBubbleTitle');
  const bubbleText = document.getElementById('chowkidaarBubbleText');
  const statusDot = document.getElementById('chowkidaarStatusDot');

  if (!bubble || !bubbleTitle || !bubbleText || !statusDot) return;

  if (analysis.level === 'HIGH' || analysis.level === 'MEDIUM') {
    statusDot.className = 'chowkidaar-status-dot danger';
    bubble.className = 'chowkidaar-bubble-alert threat';
    bubbleTitle.className = 'chowkidaar-bubble-title threat';
    bubbleTitle.innerHTML = `⚠️ ${analysis.level} THREAT ALERT!`;
    bubbleText.innerHTML = `
      <b>Reel #${post.post_id} (@${post.account_id})</b> scam lag rahi hai (Score: ${analysis.score}/100)!<br>
      <span style="color:#f87171;">${analysis.reasons[0] || 'Suspicious triggers'}</span>
      <div style="margin-top:4px; font-size:10px; color:#38bdf8;">👉 Tap karke details jaanein</div>
    `;
    bubble.style.display = 'flex';
  } else {
    statusDot.className = 'chowkidaar-status-dot';
    bubble.className = 'chowkidaar-bubble-alert safe';
    bubbleTitle.className = 'chowkidaar-bubble-title safe';
    bubbleTitle.innerHTML = `🟢 SAFE REEL CHECKED`;
    bubbleText.innerHTML = `
      <b>Reel #${post.post_id}:</b> Normal & safe social interaction. Koi scam pattern nahi mila.
    `;
    bubble.style.display = 'flex';
  }

  // Auto-hide bubble after 5.5 seconds
  if (bubbleTimeout) clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(() => {
    if (bubble) bubble.style.display = 'none';
  }, 5500);
}

// Intercept reel intersection observer
function hookReelObserverForBot() {
  const origSetupObserver = window.setupObserver;
  window.setupObserver = function() {
    if (origSetupObserver) origSetupObserver();
    
    // Additional bot hook
    const reelCards = document.querySelectorAll('.reel-card');
    const botObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const postId = parseInt(entry.target.id.replace('reel-', ''));
          const currentPost = (window.livePosts || []).find(p => p.post_id === postId);
          if (currentPost) {
            notifyBotAboutReel(currentPost);
          }
        }
      });
    }, { threshold: 0.6 });

    reelCards.forEach(c => botObserver.observe(c));
  };

  // Re-run if reels already rendered
  if (document.querySelectorAll('.reel-card').length > 0) {
    window.setupObserver();
  }
}

// 4. Interactive Chatbot Messaging
function appendBotMessage(htmlContent) {
  const container = document.getElementById('chowkidaarMessages');
  if (!container) return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  row.innerHTML = `
    <div class="msg-bubble">${htmlContent}</div>
    <div class="msg-time">${now}</div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function appendUserMessage(text) {
  const container = document.getElementById('chowkidaarMessages');
  if (!container) return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const row = document.createElement('div');
  row.className = 'msg-row user';
  row.innerHTML = `
    <div class="msg-bubble">${escapeBotHtml(text)}</div>
    <div class="msg-time">${now}</div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function sendUserMessage() {
  const input = document.getElementById('chowkidaarInput');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  appendUserMessage(text);
  input.value = '';

  // Process user message with Bot Intelligence
  setTimeout(() => {
    handleBotResponse(text);
  }, 400);
}

function handleBotInputKey(e) {
  if (e.key === 'Enter') {
    sendUserMessage();
  }
}

// 5. Intelligent Bot Response Logic (Hinglish + Security Analysis)
function handleBotResponse(query) {
  const q = query.toLowerCase();

  // If query is scanning the current reel
  if (q.includes('current reel') || q.includes('yeh reel') || q.includes('this reel') || q.includes('scan')) {
    if (!activeCurrentReel && window.livePosts && window.livePosts.length > 0) {
      activeCurrentReel = window.livePosts[0];
    }

    if (activeCurrentReel) {
      const an = analyzePost(activeCurrentReel);
      let reply = `
        <b>🔍 Current Reel Analysis (ID: #${activeCurrentReel.post_id}):</b><br>
        • <b>Author:</b> @${activeCurrentReel.account_id} (${activeCurrentReel.location || 'India'})<br>
        • <b>Risk Score:</b> <b style="color:${an.level === 'HIGH' ? '#ef4444' : (an.level === 'MEDIUM' ? '#f59e0b' : '#10b981')}">${an.score}/100 (${an.level})</b><br>
        • <b>Category:</b> ${an.category.toUpperCase()}<br><br>
        🛡️ <b>Triggers:</b><br>${an.reasons.map(r => '• ' + r).join('<br>')}<br><br>
        💡 <b>AI Chowkidaar Advice:</b><br>${an.suggestedAction}
      `;
      appendBotMessage(reply);
      return;
    }
  }

  // Safety tips query
  if (q.includes('tip') || q.includes('kaise bache') || q.includes('bachein') || q.includes('suraksha')) {
    appendBotMessage(`
      🛡️ <b>Top Cyber Security Tips:</b><br><br>
      1. <b>Kabhi OTP ya PIN share na karein:</b> Bank ya electricity board kabhi phone par OTP nahi mangte.<br>
      2. <b>AnyDesk / TeamViewer download na karein:</b> Strangers ke bolne par remote app download karte hi bank khaali ho sakta hai.<br>
      3. <b>Free Lottery / 25 Lakh Prize:</b> Agar aapne lottery ka ticket nahi kharida, to aap jeet bhi nahi sakte!<br>
      4. <b>Unknown links par click na karein:</b> Hamesha official websites (.gov.in ya verified domain) use karein.
    `);
    return;
  }

  // Fraud Reporting query
  if (q.includes('report') || q.includes('helpline') || q.includes('complaint') || q.includes('1930') || q.includes('police')) {
    appendBotMessage(`
      🚨 <b>Cyber Fraud Report Helpline:</b><br><br>
      • <b>National Cyber Crime Helpline:</b> Call <b>1930</b> (Toll-Free, 24x7)<br>
      • <b>Official Portal:</b> <a href="https://cybercrime.gov.in" target="_blank" style="color:#00d4ff;">cybercrime.gov.in</a><br>
      • <b>Chakshu Portal (Sanchar Saathi):</b> Suspicious calls ya SMS report karne ke liye.<br><br>
      <i>Agar koi scam hua ho to agle 2 ghante (Golden Hours) ke andar 1930 par call karne se paise freeze hone ke chances sabse zyada hote hain!</i>
    `);
    return;
  }

  // Check custom text for scam / threat using the Engine
  const testAnalysis = analyzePost({ post_text: query });

  if (testAnalysis.level === 'HIGH') {
    appendBotMessage(`
      🔴 <b>ALERT: YEH EK HIGH RISK SCAM / THREAT HAI (${testAnalysis.score}/100)!</b><br><br>
      Maine is text mein khatarnak patterns pakde hain:<br>
      ${testAnalysis.reasons.map(r => '• ⚠️ ' + r).join('<br>')}<br><br>
      💡 <b>Chowkidaar Advice:</b> Is par bilkul bharosa na karein! Koi bhi OTP, password ya paise mat bhejna.
    `);
  } else if (testAnalysis.level === 'MEDIUM') {
    appendBotMessage(`
      🟠 <b>WARNING: MODERATE RISK (${testAnalysis.score}/100) DETECTED!</b><br><br>
      Is text mein kuch sandehjanak (suspicious) baatein hain:<br>
      ${testAnalysis.reasons.map(r => '• ⚠️ ' + r).join('<br>')}<br><br>
      💡 <b>Chowkidaar Advice:</b> ${testAnalysis.suggestedAction}
    `);
  } else {
    // Check if it's general conversational greeting
    if (q.includes('hi') || q.includes('hello') || q.includes('kya hal') || q.includes('kaise ho')) {
      appendBotMessage(`
        Hello bhai! Main bilkul active hoon aur feeds scan kar raha hoon 🛡️. Aap koi bhi sandehjanak reel ya message yahan bhejkar check karwa sakte hain!
      `);
    } else {
      appendBotMessage(`
        🟢 <b>SAFE POST (${testAnalysis.score}/100):</b><br><br>
        Aapke diye gaye text mein koi scam, violence ya fake news ka indicator nahi mila. Yeh safe lag raha hai!<br><br>
        <small style="color:#9ca3af;">(Phir bhi financial transactions karte waqt hamesha satark rahein.)</small>
      `);
    }
  }
}

// 6. Quick Action Chip Trigger
function askQuickPrompt(action) {
  if (action === 'scan_current') {
    appendUserMessage("Current reel ko scan karke batao!");
    setTimeout(() => handleBotResponse('current reel'), 300);
  } else if (action === 'why_scam') {
    appendUserMessage("Yeh reel scam kyun hai?");
    setTimeout(() => {
      if (activeCurrentReel) {
        const an = analyzePost(activeCurrentReel);
        appendBotMessage(`
          <b>Reel #${activeCurrentReel.post_id} ke Scam Reasons:</b><br><br>
          ${an.reasons.map(r => '• ' + r).join('<br>')}<br><br>
          Isiliye AI Chowkidaar ne iska risk score <b>${an.score}/100</b> rakha hai.
        `);
      } else {
        appendBotMessage("Bhai pehle Reel Feed tab mein jakar koi reel open karein, main turant live scan karke bata dunga!");
      }
    }, 300);
  } else if (action === 'safety_tips') {
    appendUserMessage("Scam se bachne ke tips batao");
    setTimeout(() => handleBotResponse('tips'), 300);
  } else if (action === 'report_fraud') {
    appendUserMessage("Fraud kahan report karein?");
    setTimeout(() => handleBotResponse('report'), 300);
  }
}

function escapeBotHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setupChatbotListeners() {
  // Listeners if needed
}

// Auto init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChowkidaarBot);
} else {
  initChowkidaarBot();
}
