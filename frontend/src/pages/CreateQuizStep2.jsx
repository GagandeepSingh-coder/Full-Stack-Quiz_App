import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function CreateQuizStep2() {
  const location = useLocation();
  const navigate = useNavigate();

  const quizData = location.state; // from Step 1
  const numQuestions = parseInt(quizData?.num_questions) || 1;

  // Auto-generate rows from num_questions
  const [questions, setQuestions] = useState(
    Array.from({ length: numQuestions }, (_, i) => ({
      order: i + 1,
      marks: "",
      question_id: "",
    })),
  );

  const [questionOptions, setQuestionOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch from your existing GET /question/ endpoint
  useEffect(() => {
    API.get("/question/")
      .then((res) => setQuestionOptions(res.data))
      .catch((err) => {
        console.error("Failed to fetch questions", err);
        alert("Could not load questions from database.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    // Validate all rows
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question_id) {
        alert(`Please select a Question for row Q${i + 1}`);
        return;
      }
      if (!questions[i].marks || parseInt(questions[i].marks) <= 0) {
        alert(`Please enter valid Marks for Q${i + 1}`);
        return;
      }
    }

    // Check duplicate question selections
    const selectedIds = questions.map((q) => q.question_id);
    if (new Set(selectedIds).size !== selectedIds.length) {
      alert(
        "Each question can only be selected once. Please remove duplicates.",
      );
      return;
    }

    try {
      setSubmitting(true);

      // Matches your existing POST /quiz/ endpoint exactly
      const payload = {
        title: quizData.title,
        total_marks: parseInt(quizData.total_marks),
        duration: parseInt(quizData.duration),
        num_questions: parseInt(quizData.num_questions),
        questions: questions.map((q) => ({
          order: parseInt(q.order),
          marks: parseInt(q.marks),
          question_id: parseInt(q.question_id),
        })),
      };

      await API.post("/quiz/", payload);
      alert("Quiz created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Create Quiz - Step 2</h2>

        {/* Summary from Step 1 */}
        <div className="card" style={{ background: "#eaf0fb" }}>
          <strong>Title:</strong> {quizData?.title} &nbsp;|&nbsp;
          <strong>Total Marks:</strong> {quizData?.total_marks} &nbsp;|&nbsp;
          <strong>Duration:</strong> {quizData?.duration} min &nbsp;|&nbsp;
          <strong>Questions:</strong> {quizData?.num_questions}
        </div>

        {loading ? (
          <p>Loading questions from database...</p>
        ) : questionOptions.length === 0 ? (
          <p style={{ color: "red" }}>
            No questions found in database. Please add questions first.
          </p>
        ) : (
          <>
            {/* Header Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 100px 1fr",
                gap: "10px",
                fontWeight: "bold",
                padding: "10px 0",
                borderBottom: "2px solid #ccc",
              }}
            >
              <span>Order</span>
              <span>Marks</span>
              <span>#QID — Select Question</span>
            </div>

            {/* Question Rows */}
            {questions.map((q, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 100px 1fr",
                  gap: "10px",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                {/* ORDER — pre-filled, editable */}
                <input
                  type="number"
                  min="1"
                  value={q.order}
                  onChange={(e) => handleChange(index, "order", e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />

                {/* MARKS — you type this */}
                <input
                  type="number"
                  min="1"
                  placeholder="Marks"
                  value={q.marks}
                  onChange={(e) => handleChange(index, "marks", e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />

                {/* #QID — dropdown from questions table */}
                <select
                  value={q.question_id}
                  onChange={(e) =>
                    handleChange(index, "question_id", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  <option value="">-- Select Question (#QID) --</option>
                  {questionOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      #{opt.id} — {opt.question_text?.substring(0, 60)}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Action Buttons */}
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => navigate("/create")}
                style={{ background: "#95a5a6" }}
              >
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating..." : "Create Quiz"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CreateQuizStep2;
