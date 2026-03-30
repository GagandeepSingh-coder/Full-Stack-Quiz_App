# Full-Stack-Quiz_App

A full‑stack quiz application with:

- **Frontend**: React (React Router, Axios, Bootstrap‑like CSS)  
- **Backend**: Python (FastAPI ) with `app/` structure

---

## 📁 Project Structure

```text
Full-Stack-Quiz_App/
├── frontend/          ← React frontend
└── backend/           ← Python backend
    └── app/           ← main app folder
        ├── db/
        ├── models/
        ├── routes/
        ├── schemas/
        └── main.py
```

---

## 🖥️ Frontend (React) – Setup

1. Go into the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

Your React app will open at:

> `http://localhost:3000`

---

## ⚙️ Backend (Python) – Setup

1. Go into the backend folder:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv env
```

3. Activate the virtual environment:

- **Windows**:

```bash
env\Scripts\activate
```

- **Linux / macOS**:

```bash
source env/bin/activate
```

4. Install dependencies (from `requirements.txt`):

```bash
pip install -r requirements.txt
```

5. Run the backend server:

```bash
python app/main.py
```

Your backend will typically run at:

> `http://localhost:8000` (or your configured port).

---

## 🔄 Connecting Frontend and Backend

- In `frontend/src/services/api.js`, the base URL is:

```js
const API = axios.create({
  baseURL: "http://localhost:8000",
});
```

- Make sure:

  - Backend is running on `http://localhost:8000`.  
  - You can test an endpoint (e.g., `/auth/login`) with Postman or browser.

---

## 🚀 Running the Whole App

1. Start backend:

```bash
cd backend
env\Scripts\activate          # Windows
# or source env/bin/activate  # Linux/macOS
python app/main.py
```

2. In another terminal, start frontend:

```bash
cd frontend
npm start
```

- Open `http://localhost:3000` in your browser.

---

## 📦 After Cloning This Repo

Every time you clone this repo on a new machine, run:

```bash
cd Full-Stack-Quiz_App
```

Then:

- **Frontend**:

```bash
cd frontend
npm install
npm start
```

- **Backend** (if virtual env is not present):

```bash
cd backend
python -m venv env
env\Scripts\activate           # Windows
# or source env/bin/activate   # Linux/macOS
pip install -r requirements.txt
python app/main.py
```

That’s it! Your **Full‑Stack Quiz App** is up and running.
