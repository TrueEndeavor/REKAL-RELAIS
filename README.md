# 🎓 REKAL Relais - Autopilot pour Classes Mixtes

**Hackathon Project 2024**

REKAL Relais is a lightweight, web-based micro-learning tool that helps teachers manage 30 students at 30 different levels with zero extra workload.

---

## 🌟 What is REKAL Relais?

REKAL Relais gives each student the right practice at the right level, instantly generated from the teacher's lesson text. It shows the teacher who is behind, who is on track, and who needs extension, all in one small dashboard.

**Purpose:** Help French teachers survive heterogeneity inside 55-minute classes.

---

## 🎯 Core Problem Solved

- Teachers can't personalize learning for 30+ students with different levels
- Some students are bored; others are lost
- Teachers spend hours preparing differentiated materials

**REKAL Relais automates:**
- ✅ Differentiated micro-practice
- ✅ Gap detection
- ✅ Leveled learning paths
- ✅ Simple teacher insights

---

## 👥 Users

**Primary:** Secondary school teachers (collège)
- Face: lack of time, heterogeneity, curriculum pressure, behavioral disruptions

**Secondary:** Students aged 10–15
- Get quick, personalized review at their level

---

## 💡 Value Proposition

> "REKAL Relais gives each student the right help at the right moment, so teachers can manage mixed-level classes effortlessly."

**Specifically:**
- Auto-generates Foundation / Standard / Advanced practice
- Adapts difficulty based on student performance
- Keeps students engaged with short, reel-style micro-cards
- Gives teachers one glance at class gaps

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python Flask
- **AI:** Blackbox AI API (with fallback for demo)
- **Database:** JSON file (simple storage)
- **CORS:** Flask-CORS for local testing

---

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd REKAL-RELAIS
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the application:**
```bash
python app.py
```

4. **Open in browser:**
```
http://127.0.0.1:5000
```

---

## 📖 How to Use

### For Teachers:

1. **Generate Practice Cards**
   - Paste your lesson text in the text area
   - Click "Générer la pratique"
   - System generates 3 difficulty levels (Foundation, Standard, Advanced)
   - Each level has 5 Q&A pairs

2. **Monitor Progress**
   - Click "Tableau de bord"
   - See all students with colored status dots:
     - 🟢 Green = On track (>70%)
     - 🟡 Yellow = Behind (40-70%)
     - 🔴 Red = Needs help (<40%)
     - ⚫ Gray = Not started

### For Students:

1. **Start Practice**
   - Click "Élève" view
   - Select your name from dropdown
   - Answer personalized questions at your level

2. **Get Instant Feedback**
   - Type your answer
   - Click "Soumettre"
   - See if you're correct or incorrect
   - System adapts difficulty automatically

---

## 🧠 Adaptive Learning System

The system automatically adjusts difficulty:

- **Level Up:** After 3 correct answers in a row
  - Foundation → Standard → Advanced

- **Level Down:** After 2+ incorrect answers in last 3
  - Advanced → Standard → Foundation

This ensures each student is always challenged at the right level!

---

## 📁 Project Structure

```
REKAL-RELAIS/
├── app.py              # Flask backend with API endpoints
├── index.html          # Main frontend HTML
├── style.css           # Beautiful gradient UI styles
├── script.js           # Frontend logic and API calls
├── requirements.txt    # Python dependencies
├── data.json          # Student data and generated cards
├── README.md          # This file
├── TODO.md            # Implementation checklist
└── TESTING_GUIDE.md   # Comprehensive testing guide
```

---

## 🎨 Features

### MVP Features (Hackathon Demo)
- ✅ Text → AI → 3-level Q&A generator
- ✅ Student view with adaptive cards
- ✅ Mini dashboard with fake data
- ✅ Beautiful, responsive UI
- ✅ Automatic difficulty adaptation
- ✅ Progress tracking
- ✅ Fallback cards for demo reliability

### Future Features (Post-Hackathon)
- 🔜 Authentication system
- 🔜 Full analytics dashboard
- 🔜 Class imports from CSV
- 🔜 Long-term spaced repetition
- 🔜 Mobile app version
- 🔜 Multi-language support

---

## 🎯 North Star Metric

**Students completing 1 personalized micro-session**

This proves the product delivers value.

---

## 📊 User Journey Metrics

### Teacher:
- Sessions started (uploads)
- Cards generated
- Dashboard views

### Student:
- Sessions started (name select)
- Cards completed
- Level assigned
- Correct answer rate

---

## 🚀 Deployment

### Backend (Railway/Render)
1. Create new project
2. Connect GitHub repository
3. Set environment variables (optional: `BLACKBOX_API_KEY`)
4. Deploy Python app
5. Get backend URL

### Frontend (Netlify/Vercel)
1. Upload HTML, CSS, JS files
2. Update `API_BASE` in script.js to backend URL
3. Deploy
4. Get frontend URL

---

## 🐛 Troubleshooting

### Cards not generating?
- The app uses fallback cards if AI API fails
- This ensures the demo always works!

### CORS errors?
- Flask-CORS is configured
- Access via http://127.0.0.1:5000 (not file://)

### Students see "no cards"?
- Teacher must generate cards first
- Go to Teacher view and click "Générer la pratique"

---

## 🤝 Contributing

This is a hackathon project! Contributions welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

MIT License - feel free to use for educational purposes!

---

## 👨‍💻 Author

Created for Hackathon 2024

**Contact:** [Your contact info]

---

## 🎉 Acknowledgments

- Blackbox AI for the AI API
- Flask community for the excellent framework
- All teachers dealing with mixed-level classrooms!

---

## 📺 Demo Video

[Link to demo video - to be added]

---

## 🏆 Hackathon Pitch

**Problem:** Teachers can't personalize for 30+ students at different levels

**Solution:** REKAL Relais - autopilot for mixed-level classrooms

**How it works:**
1. Teacher pastes lesson text
2. AI generates 3 difficulty levels
3. Students get personalized practice
4. Teacher sees progress at a glance

**Impact:** Zero extra workload, every student at the right level!

---

**Made with ❤️ for teachers and students**
