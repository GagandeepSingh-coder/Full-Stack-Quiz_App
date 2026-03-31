# Setup.md

## Complete Setup Guide

Full-Stack Quiz App setup for React frontend + FastAPI backend with MySQL.

### Prerequisites
- Node.js 18+
- Python 3.8+  
- MySQL Server (local)
- Git

## 1. Clone Repository

```bash
git clone https://github.com/GagandeepSingh-coder/Full-Stack-Quiz_App.git
cd Full-Stack-Quiz_App
```

## 2. Backend Setup (FastAPI + MySQL)

```bash
cd backend
```

### Virtual Environment
```bash
# Create
python -m venv env

# Activate
# Windows
env\Scripts\activate
# Linux/macOS  
source env/bin/activate
```

### Dependencies
```bash
pip install -r requirements.txt
```

### Database (Run schema.sql)
```bash
# Start MySQL
sudo systemctl start mysql

# Create & populate (includes users, quizzes, questions)
mysql -u root -p < schema.sql
```

**Credentials:** `student1/password1`, `admin1/password1`

### Start Backend
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
**URL:** `http://127.0.0.1:8000/docs`

## 3. Frontend Setup (React)

**New Terminal:**
```bash
cd frontend
npm install
npm start
```
**URL:** `http://localhost:3000`

## 4. Verify Connection

1. Backend running (`127.0.0.1:8000`)
2. Frontend running (`localhost:3000`)
3. **Test Login:** `student1` / `password1`
4. Dashboard → Start quiz

## Troubleshooting

| Issue | Fix |
|-------|-----|
| DB Error | Run `schema.sql`, check `app/db/database.py` |
| CORS | Backend auto-handles |
| No Questions | Verify `quiz_questions` table has data |
| 401 Login | Use MD5-hashed passwords from schema.sql |

## Database Verification

```sql
USE quiz_app;
SELECT COUNT(*) FROM users;           -- ≥2
SELECT COUNT(*) FROM quizzes;         -- ≥1
SELECT COUNT(*) FROM quiz_questions;  -- 10
```

## Full Stack Running
