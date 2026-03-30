import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function QuizParticipants() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quiz details + all participants for this quiz
    Promise.all([
      API.get(`/quiz/${quizId}`),
      API.get(`/quiz/${quizId}/participants`),
    ])
      .then(([quizRes, participantsRes]) => {
        setQuiz(quizRes.data);
        setParticipants(participantsRes.data);
      })
      .catch((err) => {
        console.error("Failed to fetch participants", err);
        alert("Could not load participants.");
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Quiz Participants</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Quiz Title Header */}
            <div className="card" style={{ background: "#eaf0fb" }}>
              <strong>Quiz: {quiz?.title}</strong> &nbsp;|&nbsp;
              <strong>Total Marks: {quiz?.total_marks}</strong> &nbsp;|&nbsp;
              <strong>Duration: {quiz?.duration} min</strong>
            </div>

            {/* Participants Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                fontWeight: "bold",
                padding: "10px",
                borderBottom: "2px solid #ccc",
                marginTop: "10px",
              }}
            >
              <span>User</span>
              <span>Score</span>
              <span>Status</span>
              <span>Report</span>
            </div>

            {/* Participants Rows */}
            {participants.length === 0 ? (
              <p style={{ marginTop: "20px" }}>No participants yet.</p>
            ) : (
              participants.map((p) => (
                <div
                  key={p.attempt_id}
                  className="card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  {/* Username */}
                  <span>{p.username}</span>

                  {/* Score — show NA if in progress */}
                  <span>
                    {p.status === "completed"
                      ? `Score: ${p.score}`
                      : "Score: NA"}
                  </span>

                  {/* Status badge */}
                  <span
                    style={{
                      color: p.status === "completed" ? "green" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {p.status === "completed" ? "Complete" : "In-progress"}
                  </span>

                  {/* View Report link — only if completed */}
                  <span>
                    {p.status === "completed" ? (
                      <button
                        onClick={() => navigate(`/report/${p.attempt_id}`)}
                        style={{ background: "#27ae60" }}
                      >
                        View Report
                      </button>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </span>
                </div>
              ))
            )}

            {/* Back button */}
            <button
              onClick={() => navigate("/admin")}
              style={{ background: "#95a5a6", marginTop: "20px" }}
            >
              ← Back to Dashboard
            </button>
          </>
        )}
      </div>
    </>
  );
}
