# ⚡ Quick Setup Guide (FREE with Gemini API)

## 1️⃣ Get Free Gemini API Key (1 minute)

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Click **"Create API Key"**
3. Copy the key (no credit card needed!)

## 2️⃣ Update Environment Variable

Edit `.env.local` in project root:
```
GOOGLE_GENERATIVE_AI_KEY=your-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3️⃣ Run the App

```bash
npm run dev
```

Open http://localhost:3000

## 4️⃣ Try It!

- Click **☀️/🌙** in top-right to toggle dark mode
- Click an example in the left panel
- Adjust **Detail Level** in Settings
- Hit **✨ Generate Design**
- Download your outputs

---

## 📊 What's Different from Before

| Provider | Cost | Rate Limit | Setup |
|----------|------|-----------|-------|
| **Gemini (Current)** | FREE ✅ | 60/min | 1 minute |
| Together AI | Limited free | 1000/min | 5 minutes |
| OpenAI | $0.01+/request | High | Credit card |

---

## 🎨 Features

- ✅ Dark/Light theme toggle
- ✅ 5 built-in example prompts
- ✅ Auto-save design history (last 10)
- ✅ Detail level control (Concise/Balanced/Detailed)
- ✅ Download individual outputs or all 4 at once
- ✅ Responsive mobile design
- ✅ Smooth color transitions

---

## ❓ Why Gemini?

1. **100% Free** – No credit card, no billing
2. **Generous limits** – 60 requests/min is plenty for a hackathon
3. **High quality** – Gemini Pro is excellent for code/architecture
4. **Super easy** – Literally 1-minute setup
5. **No surprises** – All free, no hidden costs

---

## 🚀 Deploy (Optional)

```bash
npm install -g vercel
vercel
# When prompted for environment variable:
# GOOGLE_GENERATIVE_AI_KEY = (your key)
```

---

**Ready to build system designs completely FREE?** 🏗️

