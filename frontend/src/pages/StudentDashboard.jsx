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
        console.log("✅ QUIZZES LOADED:", res.data);
        setQuizzes(res.data);
      })
      .catch((err) => {
        console.error("❌ Dashboard error:", err);
        setError("Failed to load quizzes.");
      })
      .finally(() => setLoading(false));
  }, [token, userId, navigate]); // ✅ ESLint warning fixed: added `token`

  // Updated: use /attempt instead of /test
  const handleStartQuiz = (quizId) => navigate(`/attempt/${quizId}`);

  // Updated: use /attempt instead of /test
  const handleResumeQuiz = (quizId, attemptId) =>
    navigate(`/attempt/${quizId}?attempt=${attemptId}`);

  // View Score: uses the same QuizReport.jsx for student and admin
  const handleViewScore = (attemptId) => navigate(`/report/${attemptId}`);

  const getStatus = (quiz) =>
    (quiz.attempt_status || "not_started").replace("_", " ").toUpperCase();

  const getStatusClass = (quiz) => {
    const status = quiz.attempt_status || "not_started";
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : status === "in_progress"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">
          <p>Loading quizzes...</p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome Back to Sparkl</h1>
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No quizzes available</p>
            <p className="text-gray-400">Contact admin</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white border divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Quiz
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Marks
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{quiz.title}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {quiz.duration} min
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">
                      {quiz.total_marks}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(quiz)}`}
                      >
                        {getStatus(quiz)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">
                      {/* Start quiz */}
                      {!quiz.attempt_status && (
                        <button
                          onClick={() => handleStartQuiz(quiz.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
                        >
                          Start
                        </button>
                      )}

                      {/* Resume existing attempt */}
                      {quiz.attempt_status === "in_progress" &&
                        quiz.attempt_id && (
                          <button
                            onClick={() =>
                              handleResumeQuiz(quiz.id, quiz.attempt_id)
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm mr-2 transition"
                          >
                            Resume
                          </button>
                        )}

                      {/* View Score */}
                      {quiz.attempt_status === "completed" &&
                        quiz.attempt_id && (
                          <button
                            onClick={() => handleViewScore(quiz.attempt_id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition"
                          >
                            View Score ✅
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
