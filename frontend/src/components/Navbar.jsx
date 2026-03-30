import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div className="navbar">
      <span id="title">Quiz App</span>

      {/* Admin links */}
      {role === "admin" && (
        <>
          <button onClick={() => navigate("/admin")}>Admin Dashboard</button>
          <button onClick={() => navigate("/create")}>Create Quiz</button>
        </>
      )}

      {/* Student links */}
      {role === "student" && (
        <button onClick={() => navigate("/student")}>My Quizzes</button>
      )}

      {/* Common logout button */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
