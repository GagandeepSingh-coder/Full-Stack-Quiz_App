
# Frontend – Full‑Stack Quiz Application

This is the **React frontend** for a full‑stack quiz app that connects to a **FastAPI backend**. It supports role‑based navigation (admin vs student), quiz dashboards, timers, and automatic resumption of halted tests.

---

## 🛠 Tech Stack

- **Frontend**: React (TypeScript or JavaScript), React Router, Axios  
- **State Management**: `useState`, `useNavigate`  
- **Authentication**: JWT tokens stored in `localStorage`  
- **Styling**: Plain CSS / inline styles (or your preferred CSS library)

---

## 📂 Project Structure

- `src/App.jsx` – Main app with routes  
- `src/Login.jsx` – Login screen with JWT handling  
- `src/StudentDashboard.jsx` – Student quiz list and attempt status  
- `src/QuizAttempt.jsx` – Quiz attempt page with timer and answers  
- `src/services/api.js` – Axios instance configured to talk to the backend  
- `src/components/` – Reusable components (timer, buttons, etc.)

---

## 🔐 Login and JWT Handling

- On login, the frontend sends:

  ```js
  API.post("/auth/login", { username, password });
  ```

- The backend returns a **JWT token**:

  ```json
  { "token": "eyJhbGciOiJIUzI1NiIs..." }
  ```

- The frontend:
  - Saves the token and role in `localStorage`:

    ```js
    localStorage.setItem("token", token);
    localStorage.setItem("role", payload.role);
    ```

  - Decodes the JWT payload to read `role` and **redirects**:
    - `role === "admin"` → `navigate("/admin")`  
    - Otherwise → `navigate("/student")`

---

## 🕒 Timer and Auto‑Submit

- Each quiz has a **duration** (in minutes) sent from the backend.  
- The frontend shows a **countdown timer** during the quiz.

### Auto‑Submit on Timer End

- When the timer reaches **0**:
  - The frontend automatically calls:

    ```js
    API.post(`/attempt/${attemptId}/finish`);
    ```

  - The backend then **calculates the score** and marks the attempt as `completed`.  
  - The user is redirected to the **score report** or dashboard.

---

## 🛑 Resume on Halt (Assumption)

- The system assumes that the **user can halt the test in between** (e.g., close tab, network loss, etc.).  
- When the user **re‑opens the quiz** later:

  1. Frontend calls:

     ```js
     GET /attempt/{attempt_id}/questions
     ```

  2. Backend returns:
     - Quiz questions  
     - Previously selected answers from `responses`  

  3. Frontend **restores the previous selections** and shows the remaining time.

- This means:
  - Progress is **never lost** if the user halts the test.  
  - Only **completed** attempts are blocked from being restarted.

---

## 🧩 Custom Error Handling on Login

- Instead of using `alert("...")`, the login form now **displays the error message directly on the screen in red**.

Example:

```jsx
{error && (
  <div style={{ color: "red", textAlign: "center" }}>
    {error}
  </div>
)}
```

- Errors like:
  - “Please fill all fields”  
  - “Invalid username or password”  
  are shown **inside the login card**, improving UX.

---

## 🚀 Running the Frontend

1. Go to the frontend directory:

   ```sh
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the dev server:

   ```sh
   npm start
   ```

- By default, the app runs on `http://localhost:3000`.  
- Make sure the backend is running on `http://127.0.0.1:8000` and that `services/api.js` points to it.

---

## 📝 Notes for Evaluation

- Frontend **communicates with the backend via REST API** (FastAPI).  
- **JWT tokens** are stored securely in `localStorage` and used for all authenticated requests.  
- **Timer‑based auto‑submit** is implemented when the quiz duration ends.  
- If the user **halts the test**, the system **resumes from the last saved state** (answers and remaining time) when they reopen it.  
- **Login errors are shown on screen in red**, not via `alert()`, giving a smoother user experience.
