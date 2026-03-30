import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateQuiz() {
  const [quiz, setQuiz] = useState({
    title: "",
    total_marks: "",
    duration: "",
    num_questions: "",
  });

  const navigate = useNavigate();

  const handleNext = () => {
    // ✅ Validation
    if (
      !quiz.title ||
      !quiz.total_marks ||
      !quiz.duration ||
      !quiz.num_questions
    ) {
      alert("Please fill all fields");
      return;
    }

    navigate("/create-step2", { state: quiz });
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="card">
          <h2>Create Quiz - Step 1</h2>

          <input
            placeholder="Enter Quiz Title"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />

          <input
            placeholder="Number of Questions"
            value={quiz.num_questions}
            onChange={(e) =>
              setQuiz({ ...quiz, num_questions: e.target.value })
            }
          />

          <input
            placeholder="Total Marks"
            value={quiz.total_marks}
            onChange={(e) => setQuiz({ ...quiz, total_marks: e.target.value })}
          />

          <input
            placeholder="Enter Duration (minutes)"
            value={quiz.duration}
            onChange={(e) => setQuiz({ ...quiz, duration: e.target.value })}
          />

          <button onClick={handleNext}>Next</button>
        </div>
      </div>
    </>
  );
}

export default CreateQuiz;
