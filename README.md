# FraudVeda — AI Threat Watchdog

**Real-time scam detection for short-video content (YouTube Shorts / Reels), with a floating on-screen guard and a live SOC dashboard.**

Built for **SKIT004 — AI-Based Social Media Threat Monitoring System** · Team entry for IEEE / IGINTE.

> **Live demo link:** _not published yet — coming soon._ For now, run it locally (see [Getting Started](#getting-started)).

---

## What is FraudVeda?

Online scams in Hindi / Hinglish — "paise double", fake lottery, OTP theft, digital arrest by a fake CBI officer, fake electricity-bill cut-off, work-from-home task scams, and more — spread through reels and short videos faster than people can verify them.

FraudVeda watches what the user is watching. When a risky video shows up, a small shield bot on the screen raises a warning *before* the user acts on it, explains **why** it is risky, and lets the user **Review**, **Skip** (auto-scroll) or **Continue**. Every detection is also logged to a local analyst dashboard.

It is built to be **explainable** (every alert carries a reason in simple Hinglish) and **low on false alarms** (normal videos such as news, tutorials, reviews and genuine scam-awareness content are meant to stay SAFE).

---

## Features

### 1. Floating AI Chowkidaar (desktop widget)
- Always-on-top, draggable shield bubble with a live status dot.
- Menu: enable / disable protection, per-reel threat analytics with reason box and human-review buttons, and one-click open of the full dashboard.
- On-screen warning overlay with **Review**, **Skip (auto-scroll)** and **Continue**.

### 2. Detection engine
- Rule base from the **60-post SKIT004 dataset** (54 High, 6 Medium risk; 56 distinct scam types) in `data/skit004_dataset.json`.
- Keyword + regex matching with **word-boundary** rules.
- **Hindi (Devanagari) support** — Devanagari triggers such as `ओटीपी`, `लॉटरी`, `डिजिटल अरेस्ट` are mapped to their Hinglish equivalents before scanning.
- **Bypass handling** — spaced or stretched spellings like `p a i s a` / `doubleee` are normalised.
- **Context awareness** — three layers reduce false alarms:
  - genuine advisories (e.g. "never share your OTP", "scam se kaise bachein"),
  - news / how-to / review content,
  - generic words that can never trigger an alert on their own.
- **No cloaking** — if a title claims to be "awareness" but still contains an active demand ("abhi paise bhejo", "call karo", "share OTP now"), it is still flagged.
- Output per scan: level (`HIGH` / `MEDIUM` / `SAFE`), score (0–100), category, scam type, trick used, reason, suggested action, matched keywords.

### 3. Live screen watcher
- Reads the title of the foreground YouTube window, fetches the video title/author via YouTube's public oEmbed endpoint, and scans it.
- Detects scroll-key presses (so each new Short is re-scanned).
- Scans the clipboard **only if it holds a YouTube link** — anything else on the clipboard is not read or stored.

### 4. Web SOC dashboard (`index.html`)
- **Live Threat Watchdog (Home)** — a reels-style feed with per-reel risk badges, Previous / Next navigation.
- **Analytical Dashboard** — KPIs (total / high / medium / reviewed), risk-distribution and activity-timeline charts, topic trends, geo view, filterable alert list, human-review decisions, **CSV export**.
- **Add Reel** — paste new text to check and add it to the feed.
- **AI Chowkidaar chat** — in-page assistant that comments on the current reel and answers quick prompts.
- Live sync with the desktop widget via the local API (below).

### 5. Local API (port 8765)
Served by the widget on `127.0.0.1` only.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET`  | `/api/threats` | Live events, recent scans, reviews and counters for the dashboard |
| `POST` | `/api/scan`    | Body `{"text": "..."}` → scan result JSON (also triggers the on-screen alert) |
| `POST` | `/api/review`  | Body `{"id": "...", "decision": "..."}` → saves a human-review decision |

POST requests from any origin other than `127.0.0.1:8765` / `localhost:8765` are rejected with `403`.

---

## Getting Started

**Platform:** Windows (the widget uses Windows APIs for window titles and key state).

### Option A — Prebuilt (no Python needed)
1. Unzip the folder.
2. Double-click **`START_FRAUDVEDA.bat`**.
   It starts `FraudVeda.exe`, waits for the local server, then opens the dashboard at `http://127.0.0.1:8765/index.html` and YouTube Shorts.
3. Scroll Shorts — a warning appears when a scam-like video is detected.
4. To stop everything, run **`STOP_FRAUDVEDA.bat`**.

### Option B — From source
Requires Python 3 with Tkinter (included in the standard Windows installer). No third-party packages are needed for the widget.

```bash
python watchdog_widget.py
```
Then open <http://127.0.0.1:8765/index.html>.

`START_FRAUDVEDA.bat` also falls back to `pythonw` / `py -3` / `python` automatically if `FraudVeda.exe` is missing.

> The dashboard is a plain static page (no build step). Opening `index.html` directly works for the demo feed, but live sync with the widget needs it served from port 8765.

---

## Testing

Run the tests from the project folder. `watchdog_widget.py` imports Tkinter, so the tests need a Python that has it.

```bash
python test_audit.py        # 22 cases: auditor-reported false alarms / misses + realistic scams
python test_50_videos.py    # 50 video-title cases (safe vs scam)
python test_extended_audit.py   # extended audit (standalone copy of the rules)
```

Latest verified run: `test_audit.py` → **22/22 passed**, `test_50_videos.py` → **50/50 passed**.
These are keyword-based unit tests on hand-written titles — they show the rules behave as designed, **not** accuracy on real-world traffic.

---

## Project Structure

```
FraudVeda/
├── FraudVeda.exe              # Prebuilt Windows build (PyInstaller)
├── _internal/                 # Runtime files bundled with the .exe
├── START_FRAUDVEDA.bat        # One-click launcher
├── STOP_FRAUDVEDA.bat         # Stops widget + local server
├── watchdog_widget.py         # Widget, ThreatScanner engine, local API server
├── index.html                 # SOC dashboard + reels feed + chatbot UI
├── posts.js                   # 60-post SKIT004 demo dataset used by the dashboard
├── youtube_shorts_demo.html   # YouTube-Shorts-style page for demos
├── css/                       # style.css, chatbot.css
├── js/                        # chatbot.js (loaded by index.html) and earlier modular
│                              #   scripts: detectors, engine, feed, dashboard, data
├── data/
│   ├── skit004_dataset.json   # 60 official rules/posts (used by the widget)
│   ├── skit004_rules.js       # Same rules as a JS file
│   └── sample_threat_posts.csv
└── test_audit.py · test_50_videos.py · test_extended_audit.py
```

---

## How a Scan Works

```
Video title / pasted text
        │
        ▼
Hindi → Hinglish mapping  +  spelling-trick clean-up
        │
        ▼
Active scam demand present? ──yes──► check verified scam patterns ──► HIGH
        │no
        ▼
Genuine advisory / news / how-to? ──yes──► SAFE
        │no
        ▼
Match against 60 SKIT004 rules (needs real keyword overlap) ──► HIGH / MEDIUM
        │no match
        ▼
       SAFE
```

---

## Privacy

- Everything runs **on the user's own machine**; the server listens on `127.0.0.1` only.
- Only the foreground **YouTube window title** and **YouTube links on the clipboard** are scanned. Other clipboard content is never read or stored.
- The only outbound request is to YouTube's public oEmbed endpoint (falling back to the video page) to fetch a video's title and author.
- Review decisions and live events are kept in memory while the app runs.

## Limitations

- Windows only.
- Detection is **rule-based** (keywords and regex), so a new scam wording that is not in the rules can be missed. The design is modular so an ML model can be added later.
- It analyses **titles and text**, not the audio or video frames of a reel.
- Demo data is a fixed 60-post dataset; the dashboard shows it alongside live scans from the widget.

## Roadmap

- Audio / on-screen-text (OCR) analysis of reels.
- ML classifier alongside the rules for new scam patterns.
- Support for Instagram Reels and other platforms.
- Persistent storage and multi-user analyst workflow.
- Public hosted demo (link to be added here).

---

## Team & Event

SKIT004 hackathon project — AI-Based Social Media Threat Monitoring System.
_Team name, members and college details: add here._

## License

_Not specified yet — add before publishing._
