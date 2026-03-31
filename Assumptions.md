# Assumptions.md

## System Assumptions

Core business rules and technical assumptions for the Full-Stack Quiz App (React + FastAPI).

##  Business Rules

### 1. Single Attempt Policy
- **One attempt per user per quiz** 
- Database enforces unique constraint: `(user_id, quiz_id)`
- Status progression: `None` → `in_progress` → `completed`

### 2. Quiz Dashboard States
| Attempt Status | Button Text | Action |
|----------------|-------------|--------|
| None | "Start" | Create new attempt |
| in_progress | "Resume" | Load existing attempt + responses |
| completed | "View Score" | Show final results |

### 3. Timer & Auto-Submit
- Fixed `duration` (minutes) per quiz from backend
- Frontend countdown triggers **auto-submit** at 0:00
- API call: `POST /attempt/{attemptId}/finish`
- Backend calculates score, marks as `completed`

### 4. Halt/Resume Functionality
- User closes tab → attempt saved as "in_progress"
- Reopen quiz → GET /attempt/{id}/questions  
- Backend returns: questions + saved responses + remaining time
- Frontend restores selections automatically


## 🔧 Frontend Assumptions

### Authentication
- JWT tokens stored in `localStorage`
- JWT payload contains `role` field for routing
- Role-based redirects: `admin` → `/admin`, `student` → `/student`

### State Management
- `useState` + `useNavigate` (no Redux/Context)
- Timer runs client-side with server validation

### Error Handling
- Login errors displayed **on-screen in red** (no alerts)
- Network errors show user-friendly messages

### API Integration
- Base URL: http://127.0.0.1:8000
- Axios interceptor adds JWT Authorization header


## 🖥️ Backend Assumptions

### Authentication
- **MD5 hashed passwords** stored in `users.password`
- Login: `POST /auth/login` → `{token: "jwt..."}`
- All protected routes require `Authorization: Bearer <token>`

### Database
- **Local MySQL** (`quiz_app` database)
- Tables auto-created via SQLAlchemy `Base.metadata.create_all()`
- Manual seeding via `schema.sql`

### Core Tables
- users: id, username, password(MD5), role
- quizzes: id, title, total_marks, duration
- quiz_questions: id, quiz_id, question_text, option_a/b/c/d, correct_option
- attempts: id, user_id, quiz_id, status, score
- responses: id, attempt_id, question_id, selected_option

## 📋 API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | JWT authentication |
| GET | `/quizzes` | List available quizzes |
| POST | `/attempt` | Start new quiz attempt |
| GET | `/attempt/{id}/questions` | Resume quiz (with saved answers) |
| POST | `/attempt/{id}/response` | Save answer |
| POST | `/attempt/{id}/finish` | Complete quiz (timer expiry) |

## 🎮 User Roles & Permissions

### Admin (`role: "admin"`)
- Create/manage quizzes and questions
- View all attempts and scores
- Dashboard: `/admin`

### Student (`role: "student"`)
- View available quizzes with attempt status
- Start/resume quizzes with timer
- View personal scores only
- Dashboard: `/student`

## ⚠️ Edge Cases Handled

- **Network loss during quiz** → resume from last saved responses
- **Multiple browser tabs** → localStorage sync across tabs
- **Timer expires mid-answer** → partial credit awarded
- **Invalid/expired JWT** → redirect to login
- **Concurrent quiz attempts** → latest tab wins

## ⏱️ Timer Implementation
- Quiz duration: 10 minutes (backend field)
- Frontend: useEffect countdown → useState timer
- Timer = 0 → auto POST /finish → redirect dashboard
- Resume: backend calculates remaining_time = duration - (now - started_at)

## 📊 Data Flow Summary
- Login → JWT → role-based dashboard
- Student sees quizzes with status buttons
- "Start" → POST /attempt → in_progress
- Answer Q1 → POST /response → saved immediately
- Timer 0:00 → POST /finish → score calculated → completed
- Dashboard refresh → "View Score" button

**These assumptions define the contract between frontend, backend, database, and user experience.**
