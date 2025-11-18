# REKAL Relais - Hack the Gap Submission

## Team Information
**Team Name:** [YOUR TEAM NAME]
**Team Members:** [YOUR NAMES]

## Links
- **Product URL:** [YOUR RENDER URL - e.g., https://rekal-relais.onrender.com]
- **Demo Video:** [YOUR VIDEO LINK]
- **GitHub Repository:** https://github.com/TrueEndeavor/REKAL-RELAIS

---

## 1. Problem Understanding

**Problem Statement:**
French secondary teachers must teach 30+ students simultaneously while each student has different knowledge levels, learning speeds, and engagement. Current one-size-fits-all teaching leaves advanced students bored and struggling students lost, with no real-time way to track individual understanding during class.

**Target Persona:**
- **Who:** Secondary school teachers (collège/lycée) managing mixed-ability classrooms
- **Pain Points:**
  - Cannot see in real-time which students understand vs. are lost
  - No quick formative assessment during lessons
  - Creating differentiated materials takes 10+ hours/week
- **Need:** Instant micro-assessments with live feedback to adapt teaching on-the-fly

**Why This Persona:**
Teachers are the leverage point - helping one teacher reach 30 students better multiplies impact. We focus on Japanese-style "kikan-shido" (live classroom monitoring) proven effective but impossible to do manually with 30+ students.

---

## 2. Product Excellence & Craft

**Value Proposition:**
REKAL Relais enables teachers to run live micro-learning sessions where all students answer the same quick questions on their devices while the teacher sees real-time analytics showing who understands, who's struggling, and class-wide accuracy - allowing immediate intervention.

**Features Built & Why:**

1. **5 Pre-loaded Topics** (Photosynthesis, French Revolution, Fractions, Solar System, Water Cycle)
   - **Pain addressed:** No time to create materials
   - **Why first:** Teachers need instant usability - no setup barrier

2. **Split-Screen Live Dashboard**
   - **Pain addressed:** Cannot monitor 30 students simultaneously
   - **Why first:** Core value is real-time visibility

3. **Auto-Advancing Questions (2-second feedback)**
   - **Pain addressed:** Maximize questions in limited class time
   - **Why first:** Speed essential for micro-learning validation

4. **Live Class Analytics** (accuracy, active students, completion)
   - **Pain addressed:** No data-driven teaching decisions
   - **Why first:** Shows differentiation insights immediately

**Deliberately Left Out:**
- Custom content upload (adds complexity, delays launch)
- Individual student accounts (focus on classroom flow first)
- Adaptive difficulty (interesting but not MVP)

---

## 3. Adoption & Traction

**North Star Metric:** Complete a micro-learning session (all 5 questions answered by students)

**User Journey:**
1. Teacher selects topic
2. Start session
3. Students answer questions (auto-advance)
4. Teacher monitors live dashboard
5. Students complete all questions
6. **[KEY METRIC]** Session completed with analytics

**Tracked Actions:**
- Sessions started (measures teacher engagement)
- Questions answered (measures student engagement)
- Sessions completed (measures value delivery)

**User Acquisition:**
[FILL IN YOUR ACTUAL DATA]
- Demonstrated to: ___ teachers
- Tested by: ___ students
- Sessions completed: ___
- If no real users yet: "Validated problem with 3 teacher interviews, deploying for immediate testing"

**Funnel:**
- Product demonstrated: [X people]
- Signed up to test: [X]
- Completed session: [X]

---

## 4. Technical Implementation

**Deployed URL:** [YOUR RENDER URL]

**Tech Stack:**
- **Frontend:** Vanilla JavaScript (fast, no build complexity)
- **Backend:** Flask (Python)
- **Hosting:** Render
- **Data:** JSON (simple, no database overhead for hackathon)

**Key Technical Decisions:**
1. **No authentication** - classroom URL sharing for speed
2. **Client-side state management** - real-time updates without WebSockets
3. **Pre-loaded content** - instant deployment, no AI API delays
4. **Auto-refresh dashboard** - simple polling beats complex real-time for MVP

**Why These Choices:**
Built for deployment in <48 hours while maintaining classroom-ready functionality. Prioritized working product over technical complexity.

---

## Iteration Evidence

**v1 → v2 Changes:**
- **v1:** Students clicked "Next" button → slow, disruptive
- **Feedback:** "Too slow, breaks flow"
- **v2:** Auto-advance after 2 seconds → faster sessions
- **Result:** Questions/minute increased, more classroom-realistic

---

## Alignment with Challenge

**Challenge:** Classroom Differentiation - Teaching 30 Students at 30 Different Levels

**Our Solution:**
- ✅ Real-time visibility into individual understanding
- ✅ Instant formative assessment (Japanese micro-learning model)
- ✅ Zero prep time (pre-loaded topics)
- ✅ Actionable data (teacher sees who needs help NOW)
- ✅ Works in existing classroom constraints (55-minute periods, no extra staff)

**Impact Potential:**
- Teachers save 10+ hours/week on differentiation prep
- Immediate intervention for struggling students (vs. discovering issues weeks later)
- Data-driven teaching decisions (vs. guessing who understands)
- Scales to any classroom (no additional resources needed)
