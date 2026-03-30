import { useNavigate } from "react-router-dom";
import "./Navbar.css";

// Utility to compute initials
const getInitials = (first, last) => {
  if (!first && !last) return "??";
  return `${first?.[0]?.toUpperCase() || ""}${last?.[0]?.toUpperCase() || ""}`;
};

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const initials = getInitials(firstName, lastName);

  return (
    <div className="navbar">
      <span id="title">Quiz App</span>

      {/* Greeting text */}
      {role && firstName && lastName && (
        <span className="greeting">
          Hi, {firstName} {lastName}
        </span>
      )}

      {/* Initials in circle */}
      {role && <span className="user-icon">{initials}</span>}

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

      {/* Logout button */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        <span id="log">Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
