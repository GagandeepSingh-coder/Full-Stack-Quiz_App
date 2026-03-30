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
        setError("Failed to load quizzes.");
      })
      .finally(() => setLoading(false));
  }, [token, userId, navigate]);

  const handleStartQuiz = (quizId) => navigate(`/attempt/${quizId}`);
  const handleResumeQuiz = (quizId, attemptId) =>
    navigate(`/attempt/${quizId}?attempt=${attemptId}`);
  const handleViewScore = (attemptId) => navigate(`/report/${attemptId}`);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white p-8">
          <div className="text-center">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Student Dashboard</h1>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
              {error}
            </div>
          )}

          {quizzes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No quizzes available
            </div>
          ) : (
            <div className="overflow-x-auto shadow-lg border rounded-lg">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-purple-100 border-b">
                    <th className="border px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th className="border px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="border px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="border px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="border px-6 py-4 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quizzes.map((quiz) => {
                    const status = quiz.attempt_status || "not_started";

                    return (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="border px-6 py-4 font-medium text-gray-900">
                          {quiz.title}
                        </td>
                        <td className="border px-6 py-4 text-sm text-gray-600">
                          {quiz.duration} min
                        </td>
                        <td className="border px-6 py-4 text-sm font-medium text-gray-900">
                          {quiz.total_marks}
                        </td>
                        <td className="border px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === "completed"
                                ? "bg-green-100 text-green-800"
                                : status === "in_progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status === "completed"
                              ? "Completed"
                              : status === "in_progress"
                                ? "Resume"
                                : "Start"}
                          </span>
                        </td>
                        <td className="border px-6 py-4">
                          {!quiz.attempt_status && (
                            <button
                              onClick={() => handleStartQuiz(quiz.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition"
                            >
                              Start Quiz
                            </button>
                          )}
                          {quiz.attempt_status === "in_progress" &&
                            quiz.attempt_id && (
                              <button
                                onClick={() =>
                                  handleResumeQuiz(quiz.id, quiz.attempt_id)
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium transition"
                              >
                                Resume
                              </button>
                            )}
                          {quiz.attempt_status === "completed" &&
                            quiz.attempt_id && (
                              <button
                                onClick={() => handleViewScore(quiz.attempt_id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition"
                              >
                                View Score
                              </button>
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
