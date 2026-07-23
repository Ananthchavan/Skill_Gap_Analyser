# 🎯 Skill Gap Analyzer

> An AI-powered full-stack web application that analyzes your resume and GitHub profile against a target job role, identifies skill gaps, and generates a personalized week-by-week learning roadmap.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Upcoming Features](#-upcoming-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)

---

## 🌟 Overview

**Skill Gap Analyzer** is a smart career development tool that helps developers understand exactly what skills they need to land their dream role. Simply upload your resume, provide your GitHub profile URL, describe your target job, and let AI do the heavy lifting.

The app generates:
- A **detailed skill gap analysis** comparing your current skills vs. required skills
- A **personalized week-by-week roadmap** with daily tasks and curated resources
- A **"Smart Space"** to save and organize your learning resources per day

---

## ✨ Features

### 🔐 Authentication
- **GitHub OAuth** login for seamless developer onboarding
- **Email/Password** sign-up and login
- Session-based authentication with secure cookies

### 📊 AI-Powered Skill Analysis
- Upload your **resume (PDF)** for automatic text extraction
- Provide your **GitHub profile URL** for code skill inference
- Input a **job description** for precise requirement matching
- Specify your **experience level**, **study hours/day**, and **weeks duration**
- Optionally attest **non-codeable skills** (e.g., communication, leadership) via AI-extracted suggestions from the job description

### 🗺️ Personalized Learning Roadmap
- AI generates a structured **week-by-week timeline** based on your inputs
- Each week is broken into **daily tasks** with specific focus areas
- View roadmap progress visually with a **completion tracker**
- Tasks are persisted via **background sync** — progress is never lost

### 📚 Smart Space (Resource Manager)
- Save curated **learning resources** (articles, videos, docs) for each day
- Resources are linked directly to roadmap days for contextual access
- Persistent storage per analysis

### 📈 Dashboard
- View all your past and current analyses in one place
- See the **status** of each analysis (pending / complete)
- Quick navigation to analysis details or the full roadmap
- **Delete** analyses you no longer need

### 🎨 Modern UI/UX
- Built with **shadcn/ui** and **Radix UI** components
- **Recharts** for visual skill gap charts
- Smooth animations and responsive design
- Dark-mode-first aesthetic with the **Geist** font

---

## 🚀 Upcoming Features

### 🧠 AI Mock Quiz — Weekly Check-ins *(Coming Soon)*

After completing every week of the learning roadmap, users will be able to take an **AI-generated mock quiz** tailored to that week's content:

- **Auto-generated questions** based on the week's topics and tasks using Gemini AI
- Multiple choice, true/false, and short-answer formats
- Instant feedback with **explanations** for each answer
- **Score tracking** per week to measure improvement over time
- Questions are adaptive — harder follow-ups if answers are correct
- Results saved to your analysis profile for future review

### 🏆 Final Mock Quiz — Roadmap Completion Test *(Coming Soon)*

Upon completing the full learning roadmap, a **comprehensive final quiz** will be unlocked:

- Covers **all weeks** of the roadmap in a single cumulative assessment
- Simulates a **real technical interview** for the target role
- Includes domain-specific coding concepts, system design Q&A, and soft-skill scenarios
- Generates a **"Readiness Score"** that estimates how prepared you are for the target role
- Produces a downloadable **Completion Certificate** upon passing
- AI provides a **personalized feedback report** highlighting remaining weak areas after the final quiz

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component library |
| Recharts | Data visualization |
| Zustand | Global state management |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Passport.js | GitHub OAuth strategy |
| Multer | PDF file upload handling |
| pdf-parse | Resume text extraction |
| Google Gemini AI (`@ai-sdk/google`) | Skill analysis & roadmap generation |
| Zod | Schema validation |

---

## 📁 Project Structure

```
my-skill-analyzer/
├── backend/
│   ├── models/
│   │   └── analysis.js          # Mongoose schema for analyses
│   ├── schemas/                 # Zod validation schemas
│   ├── services/
│   │   ├── aiServices.js        # Gemini AI integration (skill analysis, roadmap)
│   │   ├── analysisProcessor.js # Background processing pipeline
│   │   └── githubService.js     # GitHub profile scraping
│   ├── passport.js              # GitHub OAuth configuration
│   ├── index.js                 # Express server & all API routes
│   ├── .env                     # Environment variables (not committed)
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions
│   │   ├── pages/
│   │   │   ├── landingpage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── AuthCallback.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NewAnalysis.jsx
│   │   │   ├── AnalysisDetails.jsx
│   │   │   └── RoadmapTimelinePage.jsx
│   │   ├── store/               # Zustand state stores
│   │   ├── App.jsx              # Router & route definitions
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   └── package.json
│
└── package.json                 # Root-level workspace config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **GitHub OAuth App** ([Create one here](https://github.com/settings/developers))
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/skill-gap-analyzer.git
cd skill-gap-analyzer/my-skill-analyzer
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` directory (see [Environment Variables](#-environment-variables) below).

### 5. Run the Development Servers

**Backend** (from `backend/` directory):
```bash
npm run dev
```
> Runs on `http://localhost:8080`

**Frontend** (from `frontend/` directory):
```bash
npm run dev
```
> Runs on `http://localhost:5173`

---

## 🔐 Environment Variables

Create `backend/.env` with the following variables:

```env
# Server
PORT=8080
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/skill-gap-analyzer
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/skill-gap

# Session
SESSION_SECRET=your_super_secret_session_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:8080/auth/github/callback

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Client URL (Frontend)
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 📡 API Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/health` | ❌ | Server health check |
| `GET` | `/auth/github` | ❌ | Initiate GitHub OAuth |
| `GET` | `/auth/github/callback` | ❌ | GitHub OAuth callback |
| `GET` | `/api/current_user` | ✅ | Get the logged-in user |
| `GET` | `/api/logout` | ✅ | Logout and clear session |
| `GET` | `/api/analysis/dashboard` | ✅ | Fetch all user analyses |
| `POST` | `/api/analysis/new` | ✅ | Create a new analysis (multipart/form-data) |
| `POST` | `/api/analysis/extract-skills` | ❌ | Extract skills from job description |
| `GET` | `/api/analysis/:id` | ✅ | Get a specific analysis by ID |
| `PATCH` | `/api/analysis/:id/progress` | ✅ | Update roadmap task completion |
| `PATCH` | `/api/analysis/:id/resources` | ✅ | Save smart space resources for a day |
| `DELETE` | `/api/analysis/:id` | ✅ | Delete an analysis |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Built with ❤️ by <a href="https://github.com/Ananthchavan">Ananth Chavan  </a></p>
