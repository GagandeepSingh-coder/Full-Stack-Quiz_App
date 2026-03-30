import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function QuizAttempt() {
  // Extract quiz ID from URL params
  const { id } = useParams(); // quiz_id
  const navigate = useNavigate();

  // State management for quiz data
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  // For timer interval reference
  const timerRef = useRef(null);

  // Get user ID from JWT token (pure values, no hooks)
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = payload?.user_id;

  // Redirect unauthenticated users using an effect
  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  // UPDATED: Finish handler - navigates to REPORT after finish
  const handleFinish = useCallback(async () => {
    // Clear timer if running
    clearInterval(timerRef.current);
    try {
      if (attemptId) {
        await API.post(`/attempt/${attemptId}/finish`);
        // GO TO REPORT INSTEAD OF DASHBOARD
        navigate(`/report/${attemptId}`);
        return;
      }
    } catch (err) {
      console.error("Failed to finish quiz:", err);
      // Fallback to dashboard if report fails
      navigate("/student");
    }
  }, [attemptId, navigate]);

  // Load quiz attempt and questions on mount
  useEffect(() => {
    // If not logged in yet, do nothing (redirect effect handles it)
    if (!token || !userId) return;

    setLoading(true);

    // Step 1: Start/Resume attempt
    API.post(`/attempt/start/${id}?user_id=${userId}`)
      .then((res) => {
        setAttemptId(res.data.id);
        setTimeLeft(res.data.time_left);
        // Step 2: Fetch questions with any saved answers
        return API.get(`/attempt/${res.data.id}/questions`);
      })
      .then((res) => {
        setQuestions(res.data);
        // Restore previously saved answers for resume functionality
        const saved = {};
        res.data.forEach((q) => {
          if (q.selected_option) saved[q.id] = q.selected_option;
        });
        setAnswers(saved);
      })
      .catch((err) => {
        console.error("Failed to load quiz:", err);
        alert("Failed to load quiz");
        navigate("/student");
      })
      .finally(() => setLoading(false));
  }, [id, userId, token, navigate]);

  // Timer countdown logic
  useEffect(() => {
    // Do not start timer if not set or already finished
    if (timeLeft === null || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // When time is over, auto-finish quiz and go to report
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount or when timeLeft changes
    return () => clearInterval(timerRef.current);
  }, [timeLeft, handleFinish]);

  // Handle option selection and save to backend
  const handleSelect = async (questionId, option) => {
    // Update local state immediately for UI feedback
    setAnswers((prev) => ({ ...prev, [questionId]: option }));

    // Save to backend for persistence
    try {
      await API.post(`/attempt/${attemptId}/answer`, {
        question_id: questionId,
        selected_option: option,
      });
    } catch (err) {
      console.error("Failed to save answer:", err);
    }
  };

  // While redirect effect runs, show a simple message
  if (!token || !userId) {
    return <h3>Redirecting to login...</h3>;
  }

  // Loading and empty states
  if (loading) return <h3>Loading quiz...</h3>;
  if (questions.length === 0) return <h3>No questions found</h3>;

  // Current question object
  const q = questions[currentIndex];

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
      >
        {/* Top bar: question count + timer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3>
            Question {currentIndex + 1} / {questions.length}
          </h3>
          <h4
            style={{
              color: timeLeft < 300 ? "#dc3545" : "#495057",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            ⏰ {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </h4>
        </div>

        {/* Question card */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "25px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            {q.question_text}
          </p>
        </div>

        {/* Options list */}
        <div style={{ marginBottom: "30px" }}>
          {["A", "B", "C", "D"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(q.id, opt)}
              style={{
                display: "block",
                width: "100%",
                margin: "12px 0",
                padding: "18px 20px",
                fontSize: "16px",
                background: answers[q.id] === opt ? "#007bff" : "#f8f9fa",
                color: answers[q.id] === opt ? "white" : "#333",
                border: "2px solid #dee2e6",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
            >
              <strong>{opt}.</strong> {q[`option_${opt.toLowerCase()}`]}
            </button>
          ))}
        </div>

        {/* Bottom navigation + finish button */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "space-between",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "10px",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            style={{
              flex: 1,
              padding: "15px 20px",
              background: "#6c757d",
              opacity: currentIndex === 0 ? 0.6 : 1,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          <button
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
            style={{
              flex: 1,
              padding: "15px 20px",
              background: "#28a745",
              opacity: currentIndex === questions.length - 1 ? 0.6 : 1,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor:
                currentIndex === questions.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Next →
          </button>

          <button
            onClick={handleFinish}
            style={{
              flex: 1,
              padding: "15px 20px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ✅ Finish & View Report
          </button>
        </div>
      </div>
    </>
  );
}
