import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedSection from "./components/FeaturedSection";
import Footer from "./components/Footer";
import React from "react";
import Loader from "./components/Loader";
import { ToastProvider } from "./context/ToastContext";

const Login = React.lazy(() => import("./pages/Login"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Profile = React.lazy(() => import("./pages/Profile"));

const InstructorDashboard = React.lazy(
  () => import("./pages/InstructorDashboard"),
);
const CreateQuestion = React.lazy(() => import("./pages/CreateQuestion"));
const CreateQuiz = React.lazy(() => import("./pages/CreateQuiz"));
const EditQuiz = React.lazy(() => import("./pages/EditQuiz"));
const QuizList = React.lazy(() => import("./pages/QuizList"));
const QuizPlayer = React.lazy(() => import("./pages/QuizPlayer"));
const InstituteSelection = React.lazy(
  () => import("./pages/InstituteSelection"),
);
const InstituteQuizList = React.lazy(() => import("./pages/InstituteQuizList"));
const Result = React.lazy(() => import("./pages/Result"));
const InstituteManagement = React.lazy(
  () => import("./pages/admin/InstituteManagement"),
);

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <React.Suspense fallback={<Loader />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <FeaturedSection />
                    </>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile/:id" element={<Profile />} />

                {/* Student Routes */}
                <Route path="/quizzes" element={<QuizList />} />
                <Route path="/quiz/:id" element={<QuizPlayer />} />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/institutes" element={<InstituteSelection />} />
                <Route
                  path="/institutes/:instituteId/quizzes"
                  element={<InstituteQuizList />}
                />

                {/* Instructor Routes with Dynamic User ID */}
                <Route
                  path="/:userId/dashboard"
                  element={<InstructorDashboard />}
                />
                <Route
                  path="/:userId/institutes"
                  element={<InstituteManagement />}
                />
                <Route path="/:userId/create-quiz" element={<CreateQuiz />} />
                <Route path="/edit-quiz/:id" element={<EditQuiz />} />
                {/* Keeping create-question as a route if needed, though strictly it's a modal now. 
                    If user wants the URL, we map it to dashboard or a specific page. 
                    For now, let's keep the route but pointing to Dashboard or CreateQuestion if it exists. 
                    User asked for /:userId/dashboard/create-quiz/create-question which implies nesting 
                    or just deep linking. I will map the main ones first. */}
                <Route
                  path="/:userId/create-question"
                  element={<CreateQuestion />}
                />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
