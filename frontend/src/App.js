// // import AdminDashboard from "./pages/AdminDashboard";
// // import StudentDashboard from "./pages/StudentDashboard";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import Login from "./pages/Login";
// // import CreateQuiz from "./pages/CreateQuiz";
// // import QuizAttempt from "./pages/QuizAttempt";
// // import Result from "./pages/Result";
// // import CreateQuizStep2 from "./pages/CreateQuizStep2";
// // import QuizParticipants from "./pages/QuizParticipants";
// // import QuizReport from "./pages/QuizReport";

// // function App() {
// //   return (
// //     <div className="App">
// //       <BrowserRouter>
// //         <Routes>
// //           <Route path="/" element={<Login />} />

// //           <Route path="/admin" element={<AdminDashboard />} />
// //           <Route path="/student" element={<StudentDashboard />} />

// //           <Route path="/create" element={<CreateQuiz />} />
// //           <Route path="/create-step2" element={<CreateQuizStep2 />} />

// //           <Route path="/attempt/:id" element={<QuizAttempt />} />
// //           <Route path="/result/:id" element={<Result />} />

// //           {/* Screen 3.1.5 */}
// //           <Route path="/participants/:quizId" element={<QuizParticipants />} />

// //           {/* Screen 3.1.6 */}
// //           <Route path="/report/:attemptId" element={<QuizReport />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </div>
// //   );
// // }

// // export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import StudentDashboard from "./pages/StudentDashboard";
// import CreateQuiz from "./pages/CreateQuiz";
// import CreateQuizStep2 from "./pages/CreateQuizStep2";
// import QuizAttempt from "./pages/QuizAttempt";
// import QuizParticipants from "./pages/QuizParticipants";
// import QuizReport from "./pages/QuizReport";
// import StudentReport from "./pages/StudentReport";

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           {/* Auth */}
//           <Route path="/" element={<Login />} />

//           {/* Admin - CMS */}
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/create" element={<CreateQuiz />} />
//           <Route path="/create-step2" element={<CreateQuizStep2 />} />
//           <Route path="/participants/:quizId" element={<QuizParticipants />} />
//           <Route path="/report/:attemptId" element={<QuizReport />} />

//           {/* Student */}
//           <Route path="/student" element={<StudentDashboard />} />
//           <Route path="/attempt/:id" element={<QuizAttempt />} />
//           {/* <Route path="/report/:attemptId" element={<StudentReport />} /> */}
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import CreateQuizStep2 from "./pages/CreateQuizStep2";
import QuizAttempt from "./pages/QuizAttempt";
import QuizParticipants from "./pages/QuizParticipants";
import QuizReport from "./pages/QuizReport";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />

          {/* Admin - CMS */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/create-step2" element={<CreateQuizStep2 />} />
          <Route path="/participants/:quizId" element={<QuizParticipants />} />

          {/* Student */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/attempt/:id" element={<QuizAttempt />} />
          {/* ✅ Same QuizReport for student "View Score" */}
          <Route path="/report/:attemptId" element={<QuizReport />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
