import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/quiz/").then((res) => setQuizzes(res.data));
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">
        <h1> Welcome Back to Sparkl CMS</h1>
        <h2>Admin Dashboard</h2>

        {quizzes.length === 0 ? (
          <p>No quizzes found. Create one!</p>
        ) : (
          quizzes.map((q) => (
            <div className="card" key={q.id}>
              <h3>{q.title}</h3>
              <p>
                <strong>Total Marks:</strong> {q.total_marks} &nbsp;|&nbsp;
                <strong>Duration:</strong> {q.duration} min
              </p>

              {/* Screen 3.1.5 — Quiz Participants */}
              <button onClick={() => navigate(`/participants/${q.id}`)}>
                View Participants
              </button>

              {/* Screen 3.1.6 — coming soon */}
              <button
                onClick={() => navigate(`/participants/${q.id}`)}
                style={{ background: "#8e44ad" }}
              >
                View Report
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
