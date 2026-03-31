# Full-Stack Quiz App

React + FastAPI quiz application with role-based access, timed quizzes, auto-submit, and resume functionality.

## ✨ Features

- JWT authentication (admin/student dashboards)
- Timed quizzes with countdown timers
- Auto-submit on timer expiry
- Resume interrupted quizzes from last saved state
- Score calculation and reporting
- On-screen error handling 

## 📁 Project Structure
```text
Full-Stack-Quiz_App/
├── frontend/ # React application
│ ├── src/App.jsx
│ ├── src/Login.jsx
│ └── src/services/api.js
├── backend/ # FastAPI application
│ └── app/
│ ├── main.py
│ ├── models/
│ ├── schemas/
│ └── db/
├── setup.md # Complete setup guide →
├── assumptions.md # Business rules →
├── trade-offs.md # Technical decisions →
└── schema.sql # Database schema + sample data
```

## 🚀 Quick Start

```bash
git clone https://github.com/GagandeepSingh-coder/Full-Stack-Quiz_App.git
cd Full-Stack-Quiz_App
# Follow detailed setup → setup.md
```

**Demo Credentials:**
- Student: student1 / password1
- Admin: admin1 / password1


## 🛠 Tech Stack

**Frontend:** React, React Router, Axios, CSS  
**Backend:** FastAPI, SQLAlchemy, JWT, MySQL

## 📚 Documentation

| Guide | Link |
|-------|------|
| [Setup Guide](./Setup.md) | Backend + Frontend installation |
| [Business Rules](./Assumptions.md) | Quiz flow & system assumptions |
| [Technical Decisions](./Tradeoff.md) | Architecture trade-offs |

## 🔗 API Access

**Backend Swagger Docs:** `http://127.0.0.1:8000/docs`

**Running:**
- Backend: `http://127.0.0.1:8000`
- Frontend: `http://localhost:3000`

---

**👉 Start here: [setup.md](./Setup.md) → Login → Test complete quiz flow!**
