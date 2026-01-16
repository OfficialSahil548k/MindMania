import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuiz, submitAttempt } from "../api/axios";
import Loader from "../components/Loader";
import Button from "../components/Button";

const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Warn before unload (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "You have an active quiz session. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const { data } = await fetchQuiz(id);
        setQuiz(data);
        setTimeLeft(data.timeLimit * 60);
      } catch (error) {
        console.error("Error loading quiz:", error);
        alert("Failed to load quiz or it might be invalid.");
        navigate("/quizzes");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [id, navigate]);

  // Timer Logic
  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true); // Auto-submit on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, loading]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (
      !autoSubmit &&
      !window.confirm("Are you sure you want to submit your quiz?")
    )
      return;

    setSubmitting(true);
    // Format answers for backend
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedOption: answers[questionId],
    }));

    try {
      const { data } = await submitAttempt({
        quizId: id,
        answers: formattedAnswers,
      });
      // Redirect to result page with the result data
      navigate(`/result/${id}`, { state: { result: data.result, quiz } });
    } catch (error) {
      console.error("Submission failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit quiz. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!quiz) return <div>Quiz not found</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Format Time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60; // Less than 1 minute

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Timer Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800 hidden sm:block">
              {quiz.title}
            </h2>
            <span className="text-sm text-gray-500 sm:hidden">
              Q {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>
          <div
            className={`text-xl font-mono font-bold ${
              isUrgent ? "text-red-500 animate-pulse" : "text-primary"
            }`}
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="mb-6">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              {currentQuestion.text}
            </h1>
          </div>

          <div className="space-y-3 mb-10">
            {currentQuestion.type === "MCQ"
              ? currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleOptionSelect(currentQuestion._id, option)
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[currentQuestion._id] === option
                        ? "border-primary bg-orange-50 text-primary font-medium shadow-sm"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                          answers[currentQuestion._id] === option
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {option}
                    </div>
                  </button>
                ))
              : // True/False
                ["True", "False"].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleOptionSelect(currentQuestion._id, option)
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[currentQuestion._id] === option
                        ? "border-primary bg-orange-50 text-primary font-medium"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              disabled={currentQuestionIndex === 0}
              className={currentQuestionIndex === 0 ? "invisible" : ""}
            >
              Previous
            </Button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={() => handleSubmit(false)}
                className="bg-green-600 hover:bg-green-700 focus:ring-green-500 py-2.5 px-8 text-lg"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPlayer;
