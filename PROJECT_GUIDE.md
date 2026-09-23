# AI Study Assistant — Complete Plain-Language Guide

This document explains **everything** about this project: the tools you used,
what every piece of code does, and how it all fits together — written so you
can explain it confidently even if you've never coded before.

---

## Part 1: The Big Picture

### What is this app?

A website where a logged-in student can:
- Type a topic and chat with an AI tutor about it
- Generate study notes on any topic
- Generate a multiple-choice quiz on any topic
- Generate a day-by-day study plan
- Upload a text/PDF file and ask questions about it
- Export notes/quizzes as downloadable files

### The two-part structure

Almost every real web app is split into two halves that talk to each other:

| Part | Name | What it does | Where it runs |
|---|---|---|---|
| **Frontend** | What the user sees | The buttons, forms, chat bubbles — the visual website | In the user's **browser** |
| **Backend**  | The brain/server | Checks passwords, talks to the AI, saves data to a database | On a **server** (right now, your own laptop) |

**Analogy:** think of a restaurant. The **frontend** is the dining room — the
menu, the tables, what the customer sees and interacts with. The **backend**
is the kitchen — where the actual work happens, out of sight. The waiter
(this is the "API") carries requests from the dining room to the kitchen and
brings the food back.

Your frontend runs at `http://localhost:5173` (that's the "dining room").
Your backend runs at `http://localhost:5000` (that's the "kitchen").
`localhost` just means "this computer" — nobody else on the internet can
reach it right now, it's only for testing on your own machine.

---

## Part 2: Every Tool You Used, Explained

### Node.js
JavaScript was originally built to run *inside browsers only*. Node.js is a
program that lets JavaScript run **outside** the browser too — directly on
your computer, like Python or Java can. This is what lets your backend
(the "kitchen") exist at all, since a server obviously isn't a browser.

### npm (Node Package Manager)
Nobody writes everything from scratch. npm is a giant library of free,
pre-written code ("packages") that other programmers published, so you can
reuse it instead of reinventing the wheel. `npm install` reads a shopping
list (`package.json`) and downloads every package on it into a folder called
`node_modules`.

**Analogy:** `package.json` is your recipe's ingredient list. `npm install`
is you going to the grocery store and buying everything on that list.
`node_modules` is your fridge full of those ingredients.

### package.json / package-lock.json
- `package.json` — the list of packages your project needs, plus custom
  shortcuts like `npm run dev` (defined under `"scripts"`).
- `package-lock.json` — an exact, locked-down record of *precisely* which
  version of every package (and every package those packages depend on) got
  installed, so the project behaves identically on any computer.

### Express
A package that makes it easy to build a backend server in Node.js — it
handles the boring, repetitive plumbing of "listen for incoming web
requests and send back responses" so you just write the interesting logic.

### React
A package for building the frontend. Instead of writing one giant tangled
webpage, you build small reusable pieces called **components** — a button,
a chat bubble, a navbar — and snap them together like Lego. Each file ending
in `.jsx` is one component.

### Vite
A tool that runs your React code during development and instantly refreshes
the browser every time you save a file, so you see changes immediately. It
also "bundles" (packages up) all your code into optimized files when you're
ready to publish the site for real users.

### Tailwind CSS
A styling toolkit. Instead of writing separate style rules in a separate
file, you add short class names directly onto your HTML elements, like
`className="bg-blue-600 text-white rounded-lg px-4 py-2"` — each of those
fragments means something specific (blue background, white text, rounded
corners, padding). It's why the app looks styled without a giant separate
CSS file.

### Prisma
A tool that lets your backend talk to a database using normal JavaScript
instead of writing raw database query language (SQL) by hand. You describe
your data's shape once (in `schema.prisma`), and Prisma generates
easy-to-use code for reading/writing that data safely.

### SQLite
The actual database — where all your users, conversations, notes, quizzes,
etc. are permanently stored. SQLite is special because the *entire
database* is just one file on your computer (`dev.db`), so there's nothing
extra to install or run — unlike bigger databases like PostgreSQL or MySQL
that need their own separate running program.

### JWT (JSON Web Token) + bcrypt
- **bcrypt**: scrambles ("hashes") a password into unreadable gibberish
  before saving it, so even if the database leaked, nobody could see actual
  passwords. When you log in, bcrypt scrambles what you typed and checks if
  it matches the stored gibberish — it never un-scrambles anything.
- **JWT**: after you log in successfully, the server hands your browser a
  signed digital "ticket" (the token). Your browser shows that ticket on
  every future request instead of re-typing your password every time — like
  a wristband at a concert that proves you already paid at the door.

### Gemini API (Google's AI)
This is the actual AI brain. Your backend sends it a question (plus
instructions on how to behave) and gets back a generated answer. Your
backend is the *only* part of the app that's allowed to talk to Gemini,
using a secret key (`GEMINI_API_KEY`) that never gets shown to the browser
— explained more in Part 5.

### VS Code
The text editor/program you used to open, read, and edit all these code
files, and its built-in **Terminal** panel, which lets you type text
commands (like `npm install`) directly to your computer instead of clicking
icons.

### The Terminal / PowerShell / Command Prompt
A text-based way to control your computer: instead of clicking, you type
commands. `cd foldername` means "move into this folder." `npm install`,
`npm run dev` etc. are commands that npm and your project's scripts
understand.

---

## Part 3: The Folder Structure

```
study-assistant/
├── backend/     ← the "kitchen" (server, database, AI calls)
└── frontend/    ← the "dining room" (what users see in the browser)
```

### Inside `backend/`

```
backend/
├── .env                 Your secret settings (API key, password salt) — never shared
├── package.json         List of backend packages needed
├── prisma/
│   └── schema.prisma    Defines the shape of your database tables
└── src/
    ├── index.js          The starting point — turns the server ON
    ├── config/db.js      Connects to the database
    ├── middleware/       Security checkpoints every request passes through
    ├── routes/           Defines each web address (URL) the server understands
    ├── controllers/      The actual logic for each address
    ├── services/         Talks to Gemini AI and reads uploaded files
    └── utils/prompts.js  The exact instructions sent to the AI
```

### Inside `frontend/`

```
frontend/
├── index.html          The single skeleton HTML page everything loads into
├── package.json         List of frontend packages needed
└── src/
    ├── main.jsx          The starting point — mounts React onto the page
    ├── App.jsx           Defines which page shows for which web address
    ├── api/client.js     How the frontend sends requests to the backend
    ├── context/          Shared login state, available to every page
    ├── pages/            One file per full page (Login, Chat, Notes...)
    └── components/       Small reusable pieces (buttons, bubbles, cards)
```

---

## Part 4: What Happens When You Run the Commands

### `npm install` (in backend, then separately in frontend)
Reads that folder's `package.json`, downloads every listed package from the
internet, and puts them in a `node_modules` folder. Backend and frontend
have **completely separate** `node_modules` because they need different
packages (Express vs. React, etc.) — that's why you installed twice.

### `npx prisma migrate dev --name init`
Reads `schema.prisma` (your database blueprint) and actually builds the
real database file (`dev.db`) with empty tables matching that blueprint —
a table for Users, one for Conversations, one for Notes, and so on.
"Migrate" means "apply this database structure change." You only need to
re-run this if you ever change `schema.prisma` later.

### `npm run dev` (in backend)
Looks inside `package.json` under `"scripts"` → `"dev"`, which is
configured to run `nodemon src/index.js`. `nodemon` starts your server
*and* watches every file for changes, auto-restarting the server whenever
you save — so you don't have to manually stop/start it while coding.
This is what printed **"Study Assistant API listening on
http://localhost:5000"** — meaning the kitchen is now open and listening
for orders.

### `npm run dev` (in frontend)
Starts Vite, which builds your React code into something a browser can
display and serves it at `http://localhost:5173`. This is the "dining
room" opening its doors.

---

## Part 5: The `.env` File and Why Secrets Matter

`.env` holds values that should **never** be shared publicly or committed to
a public code repository:

```
JWT_SECRET=...           # used to sign login "tickets" — if leaked, anyone could forge a valid login
GEMINI_API_KEY=...       # your AI credits — if leaked, someone else could burn your quota
```

Your code reads these using `process.env.GEMINI_API_KEY` instead of typing
the actual key into the code itself. That's the difference between
`.env` (real secrets, ignored by Git, stays only on your machine) and
`.env.example` (a template showing *which* settings are needed, safe to
share/commit, with fake placeholder values).

**Why the frontend never touches the API key:** if the key were in the
React code, anyone who opened your website could view the page's source
code in their browser and steal it. Because only the backend (which nobody
can peek inside) holds the key, it stays safe.

---

## Part 6: Following One Full Request, Step by Step

Let's trace exactly what happens when you type "explain recursion" in the
Chat page and hit Send. This is the best story to tell if someone asks
"walk me through your architecture."

1. **You type and click Send** in `frontend/src/pages/Chat.jsx`. This file
   calls a function that sends your message to the backend using `axios`
   (a package for making web requests), via `frontend/src/api/client.js`.

2. **Your login ticket is attached automatically.** `client.js` has a rule
   that says "before every request, attach the saved JWT token" — so the
   backend knows which user is asking.

3. **The request lands on the backend** at the address
   `POST /api/chat/conversations/:id/messages`, defined in
   `backend/src/routes/chat.routes.js`.

4. **Security checkpoint first.** Before reaching your actual logic, the
   request passes through `backend/src/middleware/auth.js`, which checks the
   JWT ticket is valid. If not, it's rejected with an error — your logic
   code never even runs.

5. **The controller takes over.** `backend/src/controllers/chatController.js`
   → `sendMessage()` function runs. It:
   - Saves your new message into the database (`prisma.message.create`)
   - Pulls the full conversation history from the database (so the AI has
     context of everything said before)
   - Builds a "system prompt" (behavior instructions) from
     `backend/src/utils/prompts.js`

6. **The AI gets called.** `backend/src/services/llmService.js` sends your
   message + history + instructions to Google's Gemini API over the
   internet, using your `GEMINI_API_KEY`.

7. **Gemini replies**, and that reply is saved into the database as another
   message, then sent back to the frontend as the response.

8. **The frontend receives it** and `Chat.jsx` adds it to the chat bubbles
   you see on screen.

Every other feature (Notes, Quiz, Study Plan, file upload) follows this
exact same shape: **frontend asks → security check → controller runs logic
→ maybe calls Gemini → saves to database → sends an answer back.**

---

## Part 7: What Each Backend File Actually Does

| File | Plain-language job |
|---|---|
| `src/index.js` | Turns the server on, tells it which routes exist |
| `src/config/db.js` | Opens one shared connection to the database |
| `src/middleware/auth.js` | The bouncer — checks your login ticket before letting a request through |
| `src/middleware/errorHandler.js` | Catches any crash so the app returns a clean error message instead of dying |
| `src/routes/auth.routes.js` | Defines `/register`, `/login`, `/me` addresses |
| `src/routes/chat.routes.js` | Defines all conversation/message addresses |
| `src/routes/study.routes.js` | Defines notes/quiz/study-plan addresses |
| `src/routes/upload.routes.js` | Defines the file-upload address |
| `src/controllers/authController.js` | Actual logic: create account (hash password), check login, return your profile |
| `src/controllers/chatController.js` | Actual logic: create/list/delete conversations, send a message and get an AI reply |
| `src/controllers/studyController.js` | Actual logic: generate + save notes, quizzes, study plans |
| `src/controllers/uploadController.js` | Actual logic: read an uploaded PDF/text file, extract its text, save it |
| `src/services/llmService.js` | The only file that talks to Gemini directly |
| `src/services/fileParser.js` | Pulls plain text out of an uploaded PDF or .txt file |
| `src/utils/prompts.js` | The exact wording of instructions sent to the AI for each feature (this is "prompt engineering") |
| `prisma/schema.prisma` | The blueprint of every database table and its columns |

---

## Part 8: What Each Frontend File Actually Does

| File | Plain-language job |
|---|---|
| `src/main.jsx` | Boots up React and mounts it onto the webpage |
| `src/App.jsx` | A map of "if the address is /chat, show the Chat page; if /notes, show Notes page" etc. |
| `src/api/client.js` | The one place that knows how to send requests to the backend, and attaches your login ticket automatically |
| `src/context/AuthContext.jsx` | Remembers whether you're logged in, and as who, across every page |
| `src/components/Navbar.jsx` | The top menu bar |
| `src/components/ProtectedRoute.jsx` | Bounces you to the Login page if you try to view a page while logged out |
| `src/components/MessageBubble.jsx` | Draws one chat message bubble |
| `src/components/QuizCard.jsx` | Renders a quiz question with clickable options and shows if you got it right |
| `src/components/FileUpload.jsx` | The "Attach .txt/.pdf" button and upload logic |
| `src/components/ExportButton.jsx` | Turns any text into a downloadable file, entirely inside the browser — no server involved |
| `src/pages/Login.jsx` / `Register.jsx` | The login/signup forms |
| `src/pages/Dashboard.jsx` | The home screen with the 4 feature cards |
| `src/pages/Chat.jsx` | The whole chat interface: sidebar of conversations + message thread |
| `src/pages/Notes.jsx` | Notes generator form + list of saved notes |
| `src/pages/Quiz.jsx` | Quiz generator form + the interactive quiz |
| `src/pages/StudyPlan.jsx` | Study plan generator form + the day-by-day plan display |

---

## Part 9: Likely Questions You Might Get Asked (with short answers)

**Q: Why a separate frontend and backend instead of one thing?**
A: Security (the AI key and database logic stay hidden from users), and it
lets each half be built, tested, and even deployed independently.

**Q: Why SQLite instead of a "real" database?**
A: For local development it needs zero setup — the whole database is one
file. Prisma makes switching to PostgreSQL for production a one-line change
in `schema.prisma`, without touching any other code.

**Q: How are passwords kept safe?**
A: They're never stored in plain text — bcrypt one-way scrambles them before
saving, and login just compares scrambled versions.

**Q: What stops someone else from reading my chats?**
A: Every backend request requires a valid JWT token identifying you, and
every database query filters `WHERE userId = you` — so even the API itself
can't return another user's data by mistake.

**Q: What's "prompt engineering" in this project?**
A: The wording in `utils/prompts.js` — for example, telling the AI to output
*only* valid JSON for quizzes, or to act as a "tutor" and ask clarifying
questions, or to answer strictly from an uploaded document when one exists.

**Q: What happens if the AI's answer for a quiz isn't valid JSON?**
A: `askLLMForJSON()` in `llmService.js` tries to parse it, and if parsing
fails, the app returns a clear error asking the user to try again, instead
of crashing.

**Q: Is this responsive/mobile-friendly?**
A: Yes — built with Tailwind's responsive utility classes, so layout adjusts
to smaller screens.

**Q: How would you deploy this for real users?**
A: Swap SQLite for a hosted PostgreSQL database, deploy the backend to a
Node-friendly host (Render, Railway, Fly.io), and deploy the frontend's
built static files (`npm run build`) to something like Vercel or Netlify.

---

## Part 10: Glossary (quick lookups)

- **API** — a defined way for two programs to talk to each other (here:
  frontend ↔ backend, and backend ↔ Gemini)
- **REST API** — a common style of API using web addresses + standard verbs
  (GET = fetch data, POST = create something, DELETE = remove something)
- **JSON** — a simple text format for structured data, e.g.
  `{"name": "Alex", "age": 20}` — used everywhere data moves around
- **Endpoint / route** — one specific web address the backend understands,
  e.g. `POST /api/auth/login`
- **Middleware** — code that runs *before* your main logic, usually for
  checks (auth, error catching)
- **Component** — a reusable chunk of frontend UI (React)
- **Hook** (e.g. `useState`) — a React tool for a component to remember
  information between renders
- **ORM** (Prisma is one) — lets you talk to a database using your
  programming language instead of raw database query syntax
- **Environment variable** — a setting read from `.env` instead of being
  hard-coded, so it can change per machine/environment without editing code
- **Token / JWT** — the signed "proof you're logged in" your browser holds
  onto after login
