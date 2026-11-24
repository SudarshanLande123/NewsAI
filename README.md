# 📰 NewsAI — MERN Stack News Application

A full-stack AI-powered news platform built with **MongoDB, Express, React, Node.js**.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗞️ News by Category | 7 categories: General, Tech, Business, Sports, Health, Science, Entertainment |
| 🔥 Trending | Most liked & viewed articles |
| ❤️ Like & 🔖 Bookmark | Persist across sessions |
| 🤖 AI Summarization | Gemini AI generates summaries, key points & sentiment |
| 🔊 Text-to-Speech | Read article summaries aloud |
| 💬 Ask AI | Q&A about any article |
| 🔍 Search | Full-text search with sorting |
| ✨ For You | Personalized feed based on preferences |
| 🌙 Dark Mode | Full dark/light theme |
| 🔐 JWT Auth | Register/Login with preferences |
| 📋 Read History | Last 50 articles read |
| 💬 Comments | Comment on articles |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Router v6
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini 1.5 Flash
- **News Data**: NewsAPI.org
- **Auth**: JWT + bcrypt

## 🚀 Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- API Keys: [NewsAPI](https://newsapi.org) + [Google AI Studio](https://aistudio.google.com)

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 4. Environment Variables (server/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-news-app
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NEWS_API_KEY=your_key_from_newsapi_org
GEMINI_API_KEY=your_key_from_google_ai_studio
CLIENT_URL=http://localhost:5173
```

## 📁 Project Structure

```
mern-news-app/
├── server/
│   └── src/
│       ├── config/db.js
│       ├── models/          # User, ArticleStats, Comment
│       ├── controllers/     # auth, news, user, ai, comment
│       ├── routes/          # Route definitions
│       ├── middleware/      # JWT auth middleware
│       └── server.js
└── client/
    └── src/
        ├── components/
        │   ├── layout/      # Navbar, Footer
        │   ├── news/        # NewsCard, NewsGrid, AISummaryModal
        │   └── auth/        # ProtectedRoute
        ├── context/         # AuthContext, ThemeContext
        ├── pages/           # All pages
        ├── services/api.js  # Axios instance
        └── App.jsx
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/news/headlines | Get headlines by category |
| GET | /api/news/search | Search news |
| GET | /api/news/trending | Trending articles |
| GET | /api/news/for-you | Personalized feed |
| POST | /api/user/like | Like/unlike article |
| POST | /api/user/bookmark | Bookmark article |
| POST | /api/ai/summarize | AI summary |
| POST | /api/ai/ask | Ask AI about article |
| GET/POST | /api/comments | Comments |
