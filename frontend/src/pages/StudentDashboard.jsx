import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const payload = useMemo(
    () => (token ? JSON.parse(atob(token.split(".")[1])) : null),
    [token],
  );
  const userId = payload?.user_id;

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    API.get(`/student/quizzes?user_id=${userId}`)
      .then((res) => {
        setQuizzes(res.data);
      })
      .catch((err) => {
        console.error("❌ Dashboard error:", err);
        setError("Failed to load quizzes.");
      })
      .finally(() => setLoading(false));
  }, [token, userId, navigate]);

  const handleStartQuiz = (quizId) => navigate(`/attempt/${quizId}`);

  const handleResumeQuiz = (quizId, attemptId) =>
    navigate(`/attempt/${quizId}?attempt=${attemptId}`);

  const handleViewScore = (attemptId) => navigate(`/report/${attemptId}`);

  const getStatusLabel = (status) => {
    if (status === "completed") return "Completed";
    if (status === "in_progress") return "In Progress";
    return "Not Started";
  };

  const getStatusClass = (status) => {
    if (status === "completed")
      return "bg-green-100 text-green-800 border border-green-200";
    if (status === "in_progress")
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
          <div className="text-center text-gray-600">
            <div className="text-2xl font-semibold">Loading quizzes...</div>
            <div className="text-sm mt-1">Please wait</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600">
              Continue your learning journey
            </p>
          </header>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-5 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {quizzes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No quizzes available
              </h2>
              <p className="text-gray-500">Contact admin to assign quizzes.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {quizzes.map((quiz) => {
                const status = quiz.attempt_status;
                const statusLabel = getStatusLabel(status);

                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {quiz.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Duration:{" "}
                          <span className="font-medium">
                            {quiz.duration} min
                          </span>{" "}
                          • Marks:{" "}
                          <span className="font-medium">
                            {quiz.total_marks}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(status)}`}
                        >
                          {statusLabel}
                        </span>

                        {/* Start */}
                        {!status && (
                          <button
                            onClick={() => handleStartQuiz(quiz.id)}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                          >
                            Start Quiz
                          </button>
                        )}

                        {/* Resume */}
                        {status === "in_progress" && quiz.attempt_id && (
                          <button
                            onClick={() =>
                              handleResumeQuiz(quiz.id, quiz.attempt_id)
                            }
                            className="inline-flex items-center justify-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition"
                          >
                            Resume
                          </button>
                        )}

                        {/* View Score */}
                        {status === "completed" && quiz.attempt_id && (
                          <button
                            onClick={() => handleViewScore(quiz.attempt_id)}
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                          >
                            View Score
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
