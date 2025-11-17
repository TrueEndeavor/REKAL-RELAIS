# 🧪 REKAL Relais - Testing Guide

## ✅ Server Status
Your Flask server is **RUNNING** on: **http://127.0.0.1:5000**

---

## 📋 Testing Checklist

### Step 1: Open the Application
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Navigate to: **http://127.0.0.1:5000**
3. You should see a beautiful purple gradient page with "🎓 REKAL Relais" header

---

### Step 2: Test Teacher View (Generate Cards)

**What to do:**
1. You should see the Teacher view by default
2. In the text area, paste this sample lesson text:

```
Les fractions sont des nombres qui représentent des parties d'un tout. Une fraction se compose d'un numérateur (le nombre du haut) et d'un dénominateur (le nombre du bas). Par exemple, dans la fraction 3/4, le 3 est le numérateur et le 4 est le dénominateur. Cela signifie que nous avons 3 parties sur un total de 4 parties égales.
```

3. Click the "✨ Générer la pratique" button
4. Wait for the loading message "⏳ Génération en cours..."

**Expected Result:**
- You should see an alert: "✅ Cartes générées avec succès!"
- Below, you'll see 3 sections:
  - 📗 Fondation (Débutants) - 5 simple Q&A pairs
  - 📘 Standard (Intermédiaire) - 5 medium Q&A pairs
  - 📕 Avancé (Experts) - 5 advanced Q&A pairs

**Note:** The app uses Blackbox AI API. If the API call fails, it will automatically use fallback cards (demo data) so the app still works!

---

### Step 3: Test Student View

**What to do:**
1. Click the "👨‍🎓 Élève" button in the navigation
2. From the dropdown, select a student name (e.g., "Alice")
3. You should see 3-5 cards appear with questions
4. Type an answer in the text field (any answer works for testing)
5. Click "✓ Soumettre" button

**Expected Result:**
- The button and input field should be disabled after submission
- You'll see either:
  - "✓ Correct ! Bien joué !" (green) if your answer matches
  - "✗ Incorrect. La bonne réponse était: [answer]" (red) if wrong
- The card border will change color (green or red)
- Progress is automatically saved to the backend

**Test with different students:**
- Alice (starts at Foundation level)
- Bob (starts at Standard level)
- Charlie (starts at Advanced level)
- Diana (starts at Foundation level)
- Eve (starts at Standard level)

---

### Step 4: Test Dashboard View

**What to do:**
1. Click the "📊 Tableau de bord" button in the navigation
2. You should see a grid of all 5 students with colored dots

**Expected Result:**
- Each student shows a colored dot indicating their status:
  - 🟢 **Green** = À jour (>70% correct answers)
  - 🟡 **Yellow** = En retard (40-70% correct)
  - 🔴 **Red** = Besoin d'aide (<40% correct)
  - ⚫ **Gray** = Pas commencé (no answers yet)

- Initially, all students should show **gray** (not started)
- After students answer questions, the dots will change color based on their performance
- Click "🔄 Actualiser" to refresh the dashboard

---

## 🔄 Testing the Adaptive System

**How it works:**
- Students start at their assigned level (Foundation, Standard, or Advanced)
- After answering 3 questions:
  - If all 3 are correct → Level UP (Foundation → Standard → Advanced)
  - If 2 or more are wrong → Level DOWN (Advanced → Standard → Foundation)

**To test:**
1. Go to Student View
2. Select "Alice" (Foundation level)
3. Answer 3 questions correctly
4. Select "Alice" again - she should now see Standard level cards!

---

## 🐛 Troubleshooting

### Problem: Page doesn't load
- **Solution:** Make sure Flask server is running. Check terminal for errors.
- Run: `python app.py` if it stopped

### Problem: "Aucune carte disponible"
- **Solution:** Go to Teacher View first and generate cards
- The system needs cards to be generated before students can practice

### Problem: Cards not generating
- **Solution:** The app uses fallback cards if Blackbox AI API fails
- This is intentional for demo purposes - the app will always work!

### Problem: CORS errors in browser console
- **Solution:** Flask-CORS is installed and configured
- Make sure you're accessing via http://127.0.0.1:5000 (not file://)

---

## 📊 What to Check

### Backend (Terminal)
- Flask server should show requests like:
  ```
  127.0.0.1 - - [date] "POST /generate HTTP/1.1" 200 -
  127.0.0.1 - - [date] "GET /student/Alice HTTP/1.1" 200 -
  127.0.0.1 - - [date] "POST /update_progress HTTP/1.1" 200 -
  127.0.0.1 - - [date] "GET /dashboard HTTP/1.1" 200 -
  ```

### Frontend (Browser Console - F12)
- Should see no errors (or only minor warnings)
- Network tab should show successful API calls (200 status)

### Data File
- Check `data.json` file - it should update with:
  - Generated cards
  - Student progress arrays
  - Level changes

---

## ✅ Success Criteria

Your app is working correctly if:
1. ✅ Teacher can generate cards (3 levels, 5 cards each)
2. ✅ Students can select their name and see personalized cards
3. ✅ Students can answer questions and see results
4. ✅ Dashboard shows colored dots for all students
5. ✅ Progress is saved (check data.json file)
6. ✅ Adaptive system works (levels change based on performance)

---

## 🎥 Demo Video Script

Once testing is complete, record a 2-3 minute demo:

1. **Intro (10 sec):** "Bonjour! Voici REKAL Relais - autopilot pour classes mixtes"
2. **Teacher View (30 sec):** Show generating cards from lesson text
3. **Student View (60 sec):** Show Alice answering questions, getting feedback
4. **Dashboard (30 sec):** Show teacher seeing all student progress at a glance
5. **Outro (10 sec):** "REKAL Relais - gérer 30 élèves à 30 niveaux sans effort!"

---

## 🚀 Next Steps After Testing

1. Test all features ✅
2. Fix any bugs found
3. Push to Git repository
4. Deploy to Railway/Render (backend)
5. Deploy to Netlify/Vercel (frontend)
6. Record demo video
7. Prepare pitch deck
8. Submit to hackathon! 🎉
