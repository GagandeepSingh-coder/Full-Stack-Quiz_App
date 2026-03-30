import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function StudentReport() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) {
      navigate("/student");
      return;
    }
    API.get(`/attempt/${attemptId}/report`)
      .then((res) => {
        console.log("✅ Report loaded:", res.data);
        setReport(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch report", err);
        alert("Could not load your report.");
        navigate("/student");
      })
      .finally(() => setLoading(false));
  }, [attemptId, navigate]);

  // Helper: get option text by letter
  const getOptionText = (question, letter) => {
    const map = {
      A: question.option_a,
      B: question.option_b,
      C: question.option_c,
      D: question.option_d,
    };
    return map[letter] || letter;
  };

  // Helper: style for each option row
  const getOptionStyle = (optionLetter, selectedOption, correctOption) => {
    const isCorrect = optionLetter === correctOption;
    const isSelected = optionLetter === selectedOption;

    if (isCorrect) {
      // Green — correct answer
      return {
        background: "#d4efdf",
        border: "1px solid #27ae60",
        borderRadius: "8px",
        padding: "12px",
        margin: "8px 0",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(39,174,96,0.15)",
      };
    }
    if (isSelected && !isCorrect) {
      // Red — wrong answer selected
      return {
        background: "#fadbd8",
        border: "1px solid #e74c3c",
        borderRadius: "8px",
        padding: "12px",
        margin: "8px 0",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(231,76,60,0.15)",
      };
    }
    // Gray — unselected
    return {
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "12px",
      margin: "8px 0",
      display: "flex",
      alignItems: "center",
      background: "#f8f9fa",
    };
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-xl font-semibold text-gray-600">
            Loading your report...
          </p>
        </div>
      </>
    );

  if (!report)
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-xl font-semibold text-red-600">Report not found</p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        {/* Summary Header */}
        <div className="mb-12 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border-2 border-emerald-200 shadow-xl">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            📊 Quiz Report
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-lg">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">
                {report.username}
              </div>
              <div className="text-sm text-gray-500">Student</div>
            </div>
            <div>
              <strong>Quiz:</strong> {report.quiz_title}
            </div>
            <div>
              <strong>Questions:</strong> {report.num_questions}
            </div>
            <div>
              <strong>Total Marks:</strong> {report.total_marks}
            </div>
            <div>
              <strong>Your Score:</strong>{" "}
              <span
                className={`text-2xl font-bold px-4 py-2 rounded-full ${
                  report.user_score >= report.total_marks * 0.6
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {report.user_score}/{report.total_marks}
              </span>
              <div className="text-sm text-gray-500">
                ({((report.user_score / report.total_marks) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            📝 Question Analysis
          </h2>
          <div className="space-y-6">
            {report.questions.map((item) => (
              <div
                key={item.order}
                className="bg-white border-2 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                {/* Question Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b-2 border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                    Question {item.order}
                  </h3>
                  <div
                    className={`px-6 py-3 rounded-full text-lg font-bold ${
                      item.marks_earned > 0
                        ? "bg-emerald-100 text-emerald-800 shadow-md"
                        : "bg-red-100 text-red-800 shadow-md"
                    }`}
                  >
                    {item.marks_earned}/{item.marks}
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-emerald-400">
                  <p className="text-xl leading-relaxed text-gray-800">
                    {item.question_text}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["A", "B", "C", "D"].map((letter) => (
                    <div
                      key={letter}
                      style={getOptionStyle(
                        letter,
                        item.selected_option,
                        item.correct_option,
                      )}
                    >
                      <input
                        type="radio"
                        readOnly
                        checked={item.selected_option === letter}
                        style={{
                          marginRight: "16px",
                          width: "20px",
                          height: "20px",
                          accentColor:
                            item.selected_option === letter
                              ? "#3498db"
                              : "gray",
                        }}
                      />
                      <span className="font-medium text-lg">{letter}.</span>{" "}
                      <span>{getOptionText(item, letter)}</span>
                      {/* Status Labels */}
                      {letter === item.correct_option &&
                        letter === item.selected_option && (
                          <span className="ml-4 px-4 py-2 bg-emerald-200 text-emerald-800 rounded-full text-sm font-bold">
                            ✓ Correct Answer
                          </span>
                        )}
                      {letter === item.correct_option &&
                        letter !== item.selected_option && (
                          <span className="ml-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border border-emerald-300">
                            ✓ Correct Answer
                          </span>
                        )}
                      {letter === item.selected_option &&
                        letter !== item.correct_option && (
                          <span className="ml-4 px-4 py-2 bg-red-200 text-red-800 rounded-full text-sm font-bold">
                            ✗ Your Answer
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/student")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
