# How to Start the Project

## Local Development
 1. Ensure MongoDB is running (local or Atlas connection string in `server/.env`).

 4. Open http://localhost:3000

## Deploying to Vercel

This project is preconfigured for Vercel with:
- Static frontend from `client/build`
- Serverless API at `api/index.js` wrapping the Express app

Steps
1) In Vercel, choose your team and import this GitHub repository from the REPO ROOT (not `client`).
2) Project name must use lowercase letters, digits, `-` or `_` (e.g., `student-health-tracker-fedf`).
3) Set Environment Variables (Production and Preview):
	- `MONGODB_URI` = your MongoDB (Atlas) connection string
	- `JWT_SECRET` = a strong random string
	- `JWT_EXPIRE` = 7d
	- `NODE_ENV` = production
	- `OPENAI_API_KEY` = (optional) enable AI features
	- `REACT_APP_API_BASE_URL` = leave unset to use same-origin `/api`
4) Click Deploy. Vercel will build the frontend and route `/api/*` to the serverless function.

Post-deploy checks
- Visit `/health` on your deployed domain → expect `{ "status": "ok" }`.
- Try login/register (requires `MONGODB_URI` and `JWT_SECRET`).
- Use the Chatbot upload (small PDF/JPG/PNG) to test OCR+summary.

Notes
- Vercel uses temporary storage for uploads; good for analysis, not long-term persistence.
- Very large images might hit serverless timeout (set to 60s in `vercel.json`).
# 🏥 Secure Medical Records Website

## 🚀 Quick Start Guide

### Super Easy Method (Recommended)
**Just double-click: `START-EVERYTHING.bat`**
- This automatically starts MongoDB + Website + Opens Browser
- Everything is done for you!

### Manual Method
1. **First:** Double-click `start-mongodb.bat` (keep window open)
2. **Then:** Double-click `start-website.bat` (keep window open)
3. **Finally:** Go to http://localhost:3000 in your browser

### To Stop Everything
**Double-click: `STOP-EVERYTHING.bat`**
- Safely stops all services
- Your data is automatically saved

## 📁 Batch Files Created

- **`START-EVERYTHING.bat`** - Complete auto-start (EASIEST!)
- **`start-mongodb.bat`** - Start database only
- **`start-website.bat`** - Start website only
- **`STOP-EVERYTHING.bat`** - Stop all services safely

## 🌐 Website URLs

- **Main Website:** http://localhost:3000
- **API Backend:** http://localhost:5000

## ✅ Features Available

1. **Medical Records** - Upload, view, download medical files
2. **Medication Reminders** - Set and manage medication schedules
3. **User Profile** - Personal information and account settings
4. **Health Tools** - BMI calculator, water intake tracker
5. **AI Health Chatbot** - Get health advice and information
6. **Emergency Information** - Store emergency contacts and medical info
7. **Appointment Scheduling** - Manage medical appointments
8. **Secure Authentication** - Login/register with JWT security
9. **File Management** - Secure file upload and storage

## 🤖 Enable ChatGPT for the Chatbot (Optional)

By default, the chatbot uses built‑in general health replies. To link it with ChatGPT (or any OpenAI‑compatible LLM URL):

1) Create a `.env` file inside the `server/` folder (same level as `index.js`) with:

```
OPENAI_API_KEY=your_openai_api_key_here
# If you're using a custom ChatGPT/OpenAI‑compatible endpoint (e.g., Azure OpenAI or a proxy), set the base URL:
OPENAI_BASE_URL=https://api.openai.com/v1
# Optionally choose a model
LLM_MODEL=gpt-4o-mini
```

2) Restart the backend (stop and start the website again). When configured, the chatbot will call the LLM; if not, it will fall back to the built‑in responses.

Notes:
- Your API key stays on the server; the frontend never sends it.
- If `OPENAI_BASE_URL` is omitted, it defaults to the standard OpenAI API.
- If no API key is set, the chatbot still works with built‑in guidance.

## 🔧 Troubleshooting

- If website doesn't load, make sure both MongoDB and website are running
- Keep all terminal windows open while using the website
- Your data persists between sessions - it's saved in MongoDB
- For any issues, try stopping everything and restarting

## 💾 Data Storage

Your medical records, reminders, and profile data are securely stored in MongoDB and will persist between sessions.

---
**Enjoy your secure medical records management system!** 🎉