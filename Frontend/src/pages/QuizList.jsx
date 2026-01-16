import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchQuizzes } from "../api/axios";
import Loader from "../components/Loader";
import Button from "../components/Button";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        // In a real app, we might pass the filter to the backend API
        const { data } = await fetchQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const categories = ["All", ...new Set(quizzes.map((q) => q.category))];

  const filteredQuizzes =
    filter === "All" ? quizzes : quizzes.filter((q) => q.category === filter);

  const handleStartQuiz = (quizId) => {
    const user = JSON.parse(localStorage.getItem("profile"));
    if (!user) {
      alert("Please log in to start a quiz.");
      navigate("/login");
      return;
    }
    navigate(`/quiz/${quizId}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Quizzes
          </h1>
          <p className="text-lg text-gray-600">
            Challenge yourself with our collection of expert-curated quizzes.
          </p>
        </div>

        {/* Helper for Instructors */}
        {(JSON.parse(localStorage.getItem("profile"))?.result?.role ===
          "instructor" ||
          JSON.parse(localStorage.getItem("profile"))?.result?.role ===
            "admin") && (
          <div className="flex justify-end mb-6">
            <Link to="/instructor-dashboard">
              <Button variant="outline">Manage Quizzes (Dashboard)</Button>
            </Link>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuizzes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No quizzes found for this category.
              </p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {quiz.category}
                    </span>
                    {quiz.isLive ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        LIVE
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">
                        Ended
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 text-sm mb-4">
                    {quiz.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {quiz.questions ? quiz.questions.length : 0} Questions
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {quiz.timeLimit} mins
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <Button
                    onClick={() => handleStartQuiz(quiz._id)}
                    className="w-full justify-center"
                  >
                    Start Quiz
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizList;
