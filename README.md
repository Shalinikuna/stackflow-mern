# StackFlow 🚀

A full-stack Q&A platform built with **React**, **Node.js + Express**, and **MongoDB** — inspired by Stack Overflow.

---

## ✨ Features

- 🔐 **JWT Authentication** — Register & login with secure token-based auth
- ❓ **Post Questions** — Ask questions with tags and rich body text
- 💬 **Answer Questions** — Post answers on any question
- ⬆️ **Upvote / Downvote Answers** — Community-driven quality signals
- ✅ **Accept Answers** — Question authors can mark a best answer
- 🏆 **Reputation System** — Earn rep for upvotes and accepted answers
- 🔍 **Search & Filter** — Full-text search and tag filtering with pagination
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🗂️ Folder Structure

```
stackflow/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   └── answerController.js
│   ├── middleware/
│   │   └── auth.js              # JWT protect & optionalAuth
│   ├── models/
│   │   ├── User.js
│   │   ├── Question.js
│   │   └── Answer.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── questions.js
│   │   └── answers.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   └── Auth.css
│       │   ├── answers/
│       │   │   ├── AnswerItem.jsx
│       │   │   └── AnswerItem.css
│       │   ├── questions/
│       │   │   ├── QuestionCard.jsx
│       │   │   └── QuestionCard.css
│       │   └── layout/
│       │       ├── Navbar.jsx
│       │       └── Navbar.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Home.css
│       │   ├── QuestionDetail.jsx
│       │   ├── QuestionDetail.css
│       │   ├── AskQuestion.jsx
│       │   └── AskQuestion.css
│       ├── utils/
│       │   └── api.js            # Axios instance with JWT interceptor
│       ├── App.jsx
│       ├── index.js
│       └── index.css
│
├── package.json                  # Root — runs both with concurrently
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd stackflow
npm run install:all
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stackflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

### 4. Run in Development

```bash
# From root — starts both backend (port 5000) and frontend (port 3000)
npm run dev
```

Or run separately:

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

### 5. Open

Navigate to **http://localhost:3000**

---

## 🔌 API Reference

### Auth

| Method | Endpoint            | Auth     | Description        |
|--------|---------------------|----------|--------------------|
| POST   | `/api/auth/register`| ❌       | Register new user  |
| POST   | `/api/auth/login`   | ❌       | Login              |
| GET    | `/api/auth/me`      | ✅       | Get current user   |

### Questions

| Method | Endpoint                | Auth     | Description           |
|--------|-------------------------|----------|-----------------------|
| GET    | `/api/questions`        | ❌       | List (search, paginate)|
| GET    | `/api/questions/:id`    | ❌       | Get single question   |
| POST   | `/api/questions`        | ✅       | Create question       |
| PUT    | `/api/questions/:id`    | ✅ Owner | Update question       |
| DELETE | `/api/questions/:id`    | ✅ Owner | Delete question       |

### Answers

| Method | Endpoint                         | Auth      | Description         |
|--------|----------------------------------|-----------|---------------------|
| GET    | `/api/answers/question/:qId`     | ❌        | Get answers for Q   |
| POST   | `/api/answers/:questionId`       | ✅        | Post an answer      |
| POST   | `/api/answers/:id/vote`          | ✅        | Up/downvote         |
| POST   | `/api/answers/:id/accept`        | ✅ Q-Author| Accept answer      |
| DELETE | `/api/answers/:id`               | ✅ Owner  | Delete answer       |

---

## 🏆 Reputation Rules

| Action                  | Points |
|-------------------------|--------|
| Answer upvoted          | +10    |
| Answer downvoted        | −2     |
| Answer accepted         | +15    |

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Axios  |
| Backend   | Node.js, Express 4                |
| Database  | MongoDB, Mongoose                 |
| Auth      | JWT (jsonwebtoken), bcryptjs      |
| Styling   | Custom CSS, Syne + Space Mono     |
| Toasts    | react-toastify                    |

---

## 📄 License

MIT
