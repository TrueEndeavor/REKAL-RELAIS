# 🚀 REKAL Relais - Deployment Guide

This guide will help you deploy REKAL Relais to production for your hackathon demo.

---

## 📋 Deployment Overview

We'll deploy in two parts:
1. **Backend (Flask API)** → Railway or Render
2. **Frontend (HTML/CSS/JS)** → Netlify or Vercel

---

## 🔧 Backend Deployment (Railway)

### Option 1: Railway (Recommended - Easy & Free)

1. **Prepare for Railway:**
   - Create a `Procfile` in your project root:
   ```
   web: python app.py
   ```
   
   - Create `runtime.txt`:
   ```
   python-3.10.0
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your REKAL-RELAIS repository
   - Railway will auto-detect Python and install dependencies
   - Click "Deploy"

3. **Configure:**
   - Go to Settings → Generate Domain
   - Copy your domain (e.g., `https://rekal-relais-production.up.railway.app`)
   - (Optional) Add environment variable: `BLACKBOX_API_KEY` if you have one

4. **Test:**
   - Visit your Railway URL
   - You should see the REKAL Relais interface!

---

### Option 2: Render (Alternative)

1. **Prepare for Render:**
   - Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: rekal-relais
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: python app.py
   ```

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect settings
   - Click "Create Web Service"

3. **Get URL:**
   - Copy your Render URL (e.g., `https://rekal-relais.onrender.com`)

---

## 🎨 Frontend Deployment (Netlify)

### Option 1: Netlify (Recommended - Easiest)

1. **Update API URL:**
   - Open `script.js`
   - Change line 1:
   ```javascript
   const API_BASE = 'https://your-railway-url.up.railway.app';
   ```
   - Replace with your actual Railway/Render URL

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.` (root)
   - Click "Deploy site"

3. **Custom Domain (Optional):**
   - Go to Site settings → Domain management
   - Add custom domain or use Netlify subdomain

---

### Option 2: Vercel (Alternative)

1. **Update API URL** (same as above)

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Framework Preset: Other
   - Click "Deploy"

---

## 🔄 Alternative: Single Deployment (Flask serves everything)

If you want everything on one server:

1. **Keep current setup** (Flask already serves static files)
2. **Deploy only to Railway/Render**
3. **No need for separate frontend deployment**
4. **Access everything via Railway URL**

This is simpler but less scalable.

---

## ✅ Post-Deployment Checklist

### Test Backend:
- [ ] Visit `https://your-backend-url.com`
- [ ] Should see the REKAL Relais interface
- [ ] Test generating cards
- [ ] Test student view
- [ ] Test dashboard

### Test API Endpoints:
- [ ] `GET /` - Should return index.html
- [ ] `POST /generate` - Should generate cards
- [ ] `GET /student/Alice` - Should return student cards
- [ ] `POST /update_progress` - Should update progress
- [ ] `GET /dashboard` - Should return dashboard data

### Check CORS:
- [ ] No CORS errors in browser console
- [ ] API calls work from frontend

---

## 🐛 Common Deployment Issues

### Issue: "Application Error" on Railway
**Solution:**
- Check Railway logs for errors
- Ensure `requirements.txt` is correct
- Verify Python version in `runtime.txt`

### Issue: CORS errors after deployment
**Solution:**
- Flask-CORS is already configured
- If issues persist, update `app.py`:
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

### Issue: API calls fail from frontend
**Solution:**
- Verify `API_BASE` in `script.js` matches your backend URL
- Check browser console for exact error
- Ensure backend is running (visit backend URL directly)

### Issue: Cards not generating
**Solution:**
- The app uses fallback cards automatically
- Check Railway/Render logs for API errors
- Fallback ensures demo always works!

---

## 📊 Environment Variables (Optional)

If you want to use Blackbox AI API with authentication:

### Railway:
1. Go to your project → Variables
2. Add: `BLACKBOX_API_KEY=your-key-here`
3. Redeploy

### Render:
1. Go to Environment → Environment Variables
2. Add: `BLACKBOX_API_KEY=your-key-here`
3. Save changes (auto-redeploys)

**Note:** The app works without API key using fallback cards!

---

## 🎥 Demo URLs

After deployment, you'll have:

- **Backend API:** `https://rekal-relais.up.railway.app`
- **Frontend (if separate):** `https://rekal-relais.netlify.app`
- **Or single URL:** `https://rekal-relais.up.railway.app` (if Flask serves all)

Use these URLs in your:
- Hackathon submission
- Demo video
- Pitch deck
- README.md

---

## 🔒 Security Notes

For production (post-hackathon):
- [ ] Add authentication
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (Railway/Render do this automatically)
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use proper database (PostgreSQL)

For hackathon demo:
- ✅ Current setup is fine!
- ✅ Focus on functionality
- ✅ Security can be added later

---

## 📈 Monitoring

### Railway:
- View logs in real-time
- Monitor CPU/memory usage
- Check deployment history

### Render:
- View logs in dashboard
- Monitor service health
- Check deployment status

### Netlify/Vercel:
- View deployment logs
- Monitor bandwidth
- Check build status

---

## 🎉 Success!

Once deployed, share your URLs:
- In your hackathon submission
- With your team
- In your demo video
- On social media!

**Your REKAL Relais is now live! 🚀**

---

## 🆘 Need Help?

If you encounter issues:
1. Check Railway/Render logs
2. Review browser console errors
3. Test API endpoints directly
4. Verify `API_BASE` URL in script.js
5. Check CORS configuration

The app is designed to work even if AI API fails (fallback cards), so your demo will always work!

---

## 📝 Quick Deploy Commands

```bash
# 1. Commit your changes
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Railway will auto-deploy from GitHub
# 3. Netlify will auto-deploy from GitHub

# That's it! 🎉
```

---

**Good luck with your hackathon! 🏆**
