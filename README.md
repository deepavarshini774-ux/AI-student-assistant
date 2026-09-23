# 📚 AI Study Assistant

An AI-powered study assistant where students enter a topic and get tutor-style
explanations, concise notes, auto-generated quizzes, and personalized
day-by-day study plans — all backed by Google Gemini (free API tier).

## Architecture

```
study-assistant/
├── backend/     Node.js + Express REST API, Prisma ORM (SQLite by default), JWT auth
└── frontend/    React (Vite) + Tailwind CSS SPA
```

**Why this stack:** a separate REST API keeps the AI/secret-handling logic
server-side only (the API key never reaches the browser), while the React
frontend stays a thin, stateless client that talks to it over `/api`. Prisma
gives a typed data layer and makes swapping SQLite for Postgres a one-line
change in `backend/prisma/schema.prisma` when deploying.

```
┌─────────────┐      REST/JSON       ┌──────────────┐      ┌────────────┐
│   React SPA  │ ───────────────────▶ │  Express API │ ───▶ │  Gemini API  │
│ (Vite, Tailw)│ ◀─────────────────── │ (JWT auth)   │      └────────────┘
└─────────────┘                      │      │
                                      ▼
                                ┌──────────┐
                                │  SQLite   │ (via Prisma)
                                └──────────┘
```

## Features

- Email/password registration & login (JWT, bcrypt-hashed passwords)
- AI chat interface with multiple, persisted conversations
- Enter a topic → get an explanation, tutored at your chosen difficulty
- Generate and save concise Markdown study notes
- Generate and save multiple-choice quizzes (auto-graded in the UI)
- Generate and save personalized multi-day study plans
- Difficulty selection: Beginner / Intermediate / Advanced
- Upload a `.txt` or `.pdf` and ask questions grounded in its content
- Export notes / quizzes / study plans as downloadable text files
- Loading states, inline error banners with retry, and empty states throughout

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env      # then paste your GEMINI_API_KEY and a JWT_SECRET
npm install
npx prisma migrate dev --name init   # creates dev.db and applies the schema
npm run dev                          # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # defaults are fine for local dev
npm install
npm run dev                          # starts on http://localhost:5173
```

Open http://localhost:5173, register an account, and start studying. The
Vite dev server proxies `/api` to the backend, so no CORS setup is needed
locally.

## Environment variables

**backend/.env**

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default `5000`) |
| `DATABASE_URL` | Prisma datasource URL (`file:./dev.db` by default) |
| `JWT_SECRET` | Secret used to sign auth tokens — set a long random string |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `GEMINI_API_KEY` | Your Gemini API key (free, from aistudio.google.com/apikey) — **never** exposed to the frontend |
| `GEMINI_MODEL` | Model name, defaults to `gemini-1.5-flash` |
| `CLIENT_ORIGIN` | Allowed CORS origin for the frontend |

**frontend/.env**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for API calls (default `/api`, proxied in dev) |

## API overview

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/auth/me` | Current user (auth required) |
| GET/POST | `/api/chat/conversations` | List / create conversations |
| GET/DELETE | `/api/chat/conversations/:id` | Fetch / delete a conversation |
| POST | `/api/chat/conversations/:id/messages` | Send a message, get an AI reply |
| POST/GET | `/api/study/notes` | Generate / list study notes |
| POST/GET | `/api/study/quizzes` | Generate / list quizzes |
| POST/GET | `/api/study/study-plans` | Generate / list study plans |
| POST | `/api/upload` | Upload a `.txt`/`.pdf`, extracts and stores its text |

All routes except `/api/auth/register` and `/api/auth/login` require a
`Authorization: Bearer <token>` header.

## Deployment notes

- Swap `datasource db { provider = "sqlite" }` for `"postgresql"` in
  `backend/prisma/schema.prisma` and point `DATABASE_URL` at a managed
  Postgres instance (Railway, Render, Supabase, etc.) for production.
- Deploy the backend anywhere that runs Node (Render, Railway, Fly.io).
- Deploy the frontend as a static build (`npm run build` → `dist/`) to
  Vercel/Netlify, with `VITE_API_BASE_URL` pointed at the deployed API.

## Project structure

```
backend/src/
├── config/db.js            Prisma client
├── middleware/auth.js       JWT verification middleware
├── middleware/errorHandler.js
├── controllers/             Route handlers (auth, chat, study, upload)
├── routes/                  Express routers
├── services/llmService.js   Gemini SDK wrapper (chat + JSON modes)
├── services/fileParser.js   PDF/TXT text extraction
└── utils/prompts.js         All prompt templates in one place

frontend/src/
├── api/client.js            Axios instance with auth header + error normalization
├── context/AuthContext.jsx  Auth state, login/register/logout
├── components/               Reusable UI (Navbar, MessageBubble, QuizCard, ...)
└── pages/                    Login, Register, Dashboard, Chat, Notes, Quiz, StudyPlan
```
