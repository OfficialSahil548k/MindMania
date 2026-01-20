import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizzes, fetchInstitutes } from "../api/axios";
import Loader from "../components/Loader";
import Button from "../components/Button";

// We can probably reuse QuizList component or create a simplified version.
// Given the requirement "all the quizes under that institute will be appear", a specific page is safer.

const InstituteQuizList = () => {
  const { instituteId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instituteName, setInstituteName] = useState("Institute");

  useEffect(() => {
    const fetchQuizzesData = async () => {
      try {
        // Fetch quizzes filtered by institute
        // Note: verify route correctness. My backend update allowed filtering by query param `institute`
        const { data } = await fetchQuizzes({ institute: instituteId });
        setQuizzes(data);

        // Fetch institute details for the header (optional but nice)
        // We'll trust the quizzes or fetch institute separately if needed.
        // For now, let's try to get institute name from the list if populated? No, quiz.institute is ObjectId usually.
        // Let's do a separate fetch for institute name or just generic header.
        // Trying separate fetch for good UX.
        try {
          const { data: instData } = await fetchInstitutes();
          const current = instData.find((i) => i._id === instituteId);
          if (current) setInstituteName(current.name);
        } catch (e) {
          /* ignore */
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (instituteId) fetchQuizzesData();
  }, [instituteId]);

  const handleTakeQuiz = (id) => {
    navigate(`/quiz/${id}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/institutes")}
            className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2 transition-colors"
          >
            &larr; Back to Institutes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {instituteName} Quizzes
          </h1>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">
              No quizzes found for this institute.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                      {quiz.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {quiz.timeLimit}m
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {quiz.description || "No description provided."}
                  </p>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 mt-auto">
                  <Button
                    onClick={() => handleTakeQuiz(quiz._id)}
                    className="w-full"
                  >
                    Start Quiz
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteQuizList;
