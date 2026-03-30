import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function QuizReport() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/attempt/${attemptId}/report`)
      .then((res) => setReport(res.data))
      .catch((err) => {
        console.error("Failed to fetch report", err);
        alert("Could not load report.");
      })
      .finally(() => setLoading(false));
  }, [attemptId]);

  // Helper: get option text by letter (A/B/C/D)
  const getOptionText = (question, letter) => {
    const map = {
      A: question.option_a,
      B: question.option_b,
      C: question.option_c,
      D: question.option_d,
    };
    return map[letter] || letter;
  };

  // Helper: background color for each option
  const getOptionStyle = (
    question,
    optionLetter,
    selectedOption,
    correctOption,
  ) => {
    const isCorrect = optionLetter === correctOption;
    const isSelected = optionLetter === selectedOption;

    if (isCorrect) {
      // Always highlight correct answer green
      return {
        background: "#d4efdf",
        border: "1px solid #27ae60",
        borderRadius: "5px",
        padding: "8px",
        margin: "5px 0",
      };
    }
    if (isSelected && !isCorrect) {
      // Highlight wrong selected answer red
      return {
        background: "#fadbd8",
        border: "1px solid #e74c3c",
        borderRadius: "5px",
        padding: "8px",
        margin: "5px 0",
      };
    }
    // Default unselected option
    return {
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "8px",
      margin: "5px 0",
    };
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="container">Loading report...</p>
      </>
    );
  if (!report)
    return (
      <>
        <Navbar />
        <p className="container">Report not found.</p>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Quiz Report</h2>

        {/* Summary Card */}
        <div
          className="card"
          style={{ background: "#eaf0fb", marginBottom: "20px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <strong>User Name:</strong> {report.username}
            </div>
            <div>
              <strong>Title:</strong> {report.quiz_title}
            </div>
            <div>
              <strong>No. of Qs:</strong> {report.num_questions}
            </div>
            <div>
              <strong>Total Score:</strong> {report.total_marks}
            </div>
            <div>
              <strong>User Score:</strong> {report.user_score}
            </div>
          </div>
        </div>

        {/* Questions */}
        {report.questions.map((item, index) => (
          <div key={index} className="card" style={{ marginBottom: "15px" }}>
            {/* Question Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <strong>Q{item.order}</strong>
              <span
                style={{
                  fontWeight: "bold",
                  color: item.marks_earned > 0 ? "green" : "red",
                }}
              >
                Marks {item.marks_earned} / {item.marks}
              </span>
            </div>

            {/* Question Text */}
            <p>{item.question_text}</p>

            {/* Options A B C D */}
            {["A", "B", "C", "D"].map((letter) => (
              <div
                key={letter}
                style={getOptionStyle(
                  item,
                  letter,
                  item.selected_option,
                  item.correct_option,
                )}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={item.selected_option === letter}
                  style={{ marginRight: "8px" }}
                />
                {getOptionText(item, letter)}
                {/* Labels */}
                {letter === item.correct_option && (
                  <span
                    style={{
                      color: "green",
                      marginLeft: "10px",
                      fontSize: "12px",
                    }}
                  >
                    ✓ Correct Answer
                  </span>
                )}
                {letter === item.selected_option &&
                  letter !== item.correct_option && (
                    <span
                      style={{
                        color: "red",
                        marginLeft: "10px",
                        fontSize: "12px",
                      }}
                    >
                      ✗ Your Answer
                    </span>
                  )}
              </div>
            ))}
          </div>
        ))}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{ background: "#95a5a6", marginTop: "10px" }}
        >
          ← Back
        </button>
      </div>
    </>
  );
}
