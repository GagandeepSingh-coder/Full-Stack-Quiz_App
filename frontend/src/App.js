import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import CreateQuizStep2 from "./pages/CreateQuizStep2";
import QuizAttempt from "./pages/QuizAttempt";
import QuizParticipants from "./pages/QuizParticipants";
import QuizReport from "./pages/QuizReport";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />

          {/* Admin - CMS */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/create-step2" element={<CreateQuizStep2 />} />
          <Route path="/participants/:quizId" element={<QuizParticipants />} />

          {/* Student */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/attempt/:id" element={<QuizAttempt />} />
          {/* ✅ Same QuizReport for student "View Score" */}
          <Route path="/report/:attemptId" element={<QuizReport />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
