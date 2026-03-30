# Backend – Full‑Stack Quiz Application

This backend powers a **web‑based quiz system** with role‑based access (admin, student) and supports creating, attempting, and scoring quizzes. The frontend is built in React, and the backend is built with **FastAPI + SQLAlchemy + MySQL**.

---

## 🛠 Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, JWT
- **Database**: MySQL (runs locally)
- **Authentication**: JWT tokens stored in `localStorage`, with role‑based routing (admin / student)

---

## 📂 Structure

- `main.py` – FastAPI entrypoint  
- `app/auth/` – Login, registration, JWT token generation  
- `app/quiz/` – CRUD for quizzes and questions  
- `app/attempts/` – Logic for quiz attempts, answers, and scoring  
- `app/models/models.py` – Database models (`User`, `Quiz`, `Attempt`, `Response`, etc.)  
- `app/schemas/schemas.py` – Pydantic schemas for request/response validation  

---

## 🐬 Database Setup (MySQL Local)

- This project uses a **local MySQL database** (`quiz_app` or similar).  
- Initially, **no migrations** are used; the schema is created directly in MySQL and managed manually.

### Steps

1. Install and start MySQL:

   ```sh
   sudo systemctl start mysql
   ```

2. Create the database:

   ```sql
   CREATE DATABASE quiz_app;
   USE quiz_app;
   ```

3. Manually create tables (or import from `schema.sql`) using MySQL CLI or a GUI client.

4. **Fill entries using MySQL CLI** (this is assumed and done directly in the local DB, not via API):

   Example:

   ```sql
   -- Users
   INSERT INTO users (username, password, role)
   VALUES ('student1', MD5('password1'), 'student'),
          ('admin1',   MD5('password1'), 'admin');

   -- Quizzes
   INSERT INTO quizzes (title, total_marks, duration)
   VALUES ('Sample Quiz', 100, 10);

   -- Questions
   -- ... INSERT INTO questions ...
   ```

---

## 🔐 Passwords Stored in MD5

- All **user passwords in the `users` table are stored in MD5‑hashed form**, not plain text.
- Backend logic:

  - On registration:
    - Password is hashed using `MD5` before insertion into the DB.  
  - On login:
    - Entered password is converted to MD5 and compared with the stored hash.

**Example in backend:**

```python
def md5_hash(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()
```

So, **never store raw passwords**; only the MD5‑hashed value.

---

## 🧩 Assumptions in the System

The following assumptions are built into the backend logic:

1. **User can halt the test in between**  
   - The system **persists the attempt and responses** in `attempts` and `responses` tables.  
   - When the user resumes the quiz, the backend **loads the existing `in_progress` attempt** and restores the previously selected answers automatically.

2. **Timer‑based auto‑submit**  
   - Each quiz has a fixed `duration` (in minutes).  
   - When the **timer is over**, the frontend automatically calls the `/attempt/{attempt_id}/finish` endpoint.  
   - Backend then **calculates the score and marks the attempt as `completed`**, even if the user never manually clicked “Submit”.

3. **Single attempt per user–quiz (business rule assumed)**  
   - Backend checks if a user already has an attempt for a quiz:
     - If `status = "completed"` → blocks new start.  
     - If `status = "in_progress"` → allows resuming instead of creating a duplicate.  
   - A **unique constraint** on `(user_id, quiz_id)` is suggested in the DB to enforce this at the schema level.

4. **Manual data entry via MySQL CLI**  
   - Quiz titles, questions, marks, and initial user data can be **pre‑filled directly in MySQL CLI**, not only via API.  
   - This is acceptable for **local development / demo** where rapid setup is required.

---

## 🚀 Running the Backend

1. Create and activate a virtual environment:

   ```sh
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # or
   venv\Scripts\activate     # Windows
   ```

2. Install dependencies:

   ```sh
   pip install -r requirements.txt
   ```

3. Set environment variables (if any) or adjust DB config in `app/db/database.py`.

4. Start the server:

   ```sh
   uvicorn main:app --reload
   ```

- Backend will run on `http://127.0.0.1:8000`  
- Frontend should be configured to make API calls on this host.

---

## 📊 Admin / Student Flow

- **Admin**  
  - Can create quizzes, add questions, view participants, and see scores.

- **Student**  
  - Logs in → dashboard shows all quizzes with attempt status:
    - `None` → not started → “Start”  
    - `in_progress` → in progress → “Resume”  
    - `completed` → completed → “View Score”  
  - When timer ends, quiz is auto‑submitted; partial answers are saved.

---

## 📝 Notes for Evaluation

- Built on **local MySQL** with **manual data pre‑filling** via MySQL CLI.  
- **Passwords stored in MD5‑hashed form** in the `users` table, not plaintext.  
- System **supports resuming** halted quizzes from the last saved state.  
- **Timer‑based auto‑submit** is implemented via frontend timer + `finish` API call.  
- Role‑based navigation (`admin` → `/admin`, `student` → `/student`) is handled using JWT payload.

