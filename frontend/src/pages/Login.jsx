import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await API.post("/login", { email, password });
//       localStorage.setItem("token", response.data.token);
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }
function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  // loading state to disable login button while request is in progress
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      alert("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      // post request to backend to get resposne  which contains JWT token
      const res = await API.post("/auth/login", form);
      // SAVES token in localStorage for future authenticated requests
      localStorage.setItem("token", res.data.token);
      // DECODE JWT to extract user role and save it in localStorage for role-based access control
      // JWT structure: header.payload.signature, we need the payload which is the second part
      // atob decodes base64 string, split(".")[1] gets the payload part of the token
      // After decoding, we parse the JSON to get the payload object which contains user info including role
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      localStorage.setItem("role", payload.role);

      // 🔥 ROLE-BASED REDIRECT
      if (payload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.log(err);
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div
        className="card"
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          marginTop: "100px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
