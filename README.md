# ⚡ KeyDash — Modern & Playful Typing Speed Tester

**KeyDash** is a full-stack, resume-grade typing speed web application designed with a warm "stationery + mechanical keyboard" aesthetic. It provides real-time per-character accuracy, ghost racer pace replay, on-screen virtual keyboard feedback, sound synthesis, personal dashboards, and global leaderboards.

---

## 🌟 Key Features

### 1. Core Typing Experience
- **Test Modes**:
  - **Time Modes**: 15s, 30s, 60s, 120s
  - **Word Modes**: 10 words, 25 words, 50 words
- **4 Text Categories**:
  - 🌱 **Easy Words**: Common vocabulary and lowercase flow practice
  - ✨ **Medium Sentences**: Standard grammar, punctuation, and capitalization
  - ⚡ **Hard Challenges**: Technical syntax, camelCase, numbers, and symbols
  - 💬 **Quotes**: Inspiring programming, philosophy, and literary quotes
- **Live Metrics**: Real-time calculated **WPM**, **Raw WPM**, **Accuracy %**, and **Consistency %**.
- **Smooth Animated Caret**: Smooth interpolation cursor with color-coded character feedback (correct = emerald, error = coral/red, untyped = muted).
- **Error Tracking**: Tracks total errors (including corrected/backspaced characters) and immediate keystroke errors.
- **Smart Focus & Auto-Pause**: Automatically pauses test if the browser tab loses focus, with a one-click resume overlay.
- **Keyboard Shortcuts**: `Enter` / `Tab + Enter` for instant retry; `Esc` for fast test reset.

### 2. Creative & Unique Features
- ⌨️ **Interactive Virtual Keyboard**: Lights up the key being pressed in real-time with red shake flashes for errors.
- 👻 **Ghost Racer**: A faded second caret tracks and races against your personal best (or baseline) pace.
- 🔊 **Web Audio Synthesizer**: Synthesizes tactile mechanical switch clicks, bottom-out thuds, error sounds, and completion chimes (with persistent mute toggle).
- 🏆 **WPM Rank Titles & Badges**:
  - 🐌 **Snail** (< 30 WPM)
  - 🚶 **Walker** (30 - 49 WPM)
  - 🚴 **Cyclist** (50 - 69 WPM)
  - 🏃💨 **Sprinter** (70 - 89 WPM)
  - 🐆 **Cheetah** (90 - 109 WPM)
  - 🚀 **Rocket** (110+ WPM)
- 🎉 **Confetti Celebration**: Confetti bursts when achieving a new Personal Best.
- 🌓 **Theme Engine**: Light ("Warm Stationery Cream") and Dark ("Midnight Mechanical") themes.

### 3. Demo Authentication & Guest-First Flow
- **Guest-First**: Take unlimited tests freely without signing in.
- **Demo Login**: Centered 2-column split card with an original SVG illustration, animated floating keycaps, and password visibility toggle.
  - **Username**: `demo`
  - **Password**: `typing123`
- **User Dashboard**: Personal bests, 25-test WPM progression charts, accuracy trends, daily practice streak counter, and full test history table.
- **Global Leaderboards**: Filterable mode tabs, podium cards with 🥇 Gold, 🥈 Silver, 🥉 Bronze medals, and highlighted current user ranking.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Plain CSS (CSS Variables Design System, No Tailwind), React Router v6 |
| **Charts** | Recharts (Responsive WPM progression line charts) |
| **Icons & Effects** | Lucide React, Canvas-Confetti, Web Audio API |
| **Backend** | Python 3.12+, FastAPI, Uvicorn |
| **Database** | SQLite via SQLAlchemy ORM |
| **Security** | Python-Jose (JWT tokens), Anti-Cheat validation |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed database with 70+ texts, demo user, and 15 leaderboard competitors
python -m app.seed

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --port 8000 --reload
```

The backend will be running at `http://127.0.0.1:8000`. Interactive API docs (Swagger UI) are available at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

The web application will open at `http://127.0.0.1:5173`.

---

## 🔑 Demo Credentials

- **Username**: `demo`
- **Password**: `typing123`

---

## 📡 REST API Documentation

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/login` | No | Authenticate demo credentials, returns JWT token |
| `GET` | `/api/auth/me` | Yes | Get currently authenticated user profile |
| `GET` | `/api/texts` | No | Get random practice text by `category`, `difficulty`, or `mode` |
| `GET` | `/api/texts/all` | No | List practice texts |
| `POST` | `/api/results` | Yes | Save test score (with anti-cheat validation) |
| `GET` | `/api/results/me` | Yes | Retrieve authenticated user's test history |
| `GET` | `/api/stats/me` | Yes | User statistics (Best WPM, Avg WPM, Avg Acc, Streak, Mode Bests) |
| `GET` | `/api/leaderboard` | No | Top 10 rankings per mode (one best per user) |

### Anti-Cheat & Validation Rules
The `/api/results` endpoint validates all submissions:
- Rejects WPM > 250 (exceeds human capability)
- Rejects accuracy not between 0% and 100%
- Rejects consistency not between 0% and 100%
- Rejects tests with duration < 0.5s or durations exceeding mode limits

---

## 🎨 Vector Illustration
The vector illustration is located at:
`frontend/src/assets/login-illustration.svg`

It is an inline hand-crafted SVG featuring an ergonomic typing setup, glowing monitor, floating 3D keycaps (`W`, `P`, `M`), a stopwatch, and ambient sparkles animated via pure CSS.

---

## 🔮 Future Improvements
- [ ] Real-time multiplayer typing battles via WebSockets
- [ ] Custom mechanical switch audio soundpacks (Cherry MX Blue, Cherry MX Brown, Gateron Yellow, Holy Panda)
- [ ] Custom user-uploaded text passages and code snippet modes (JS, Python, Rust, Go)
- [ ] Heatmap visualizer showing character error rates per keyboard finger zones
