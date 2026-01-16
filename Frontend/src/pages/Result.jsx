import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { fetchAttempt } from "../api/axios";
import Loader from "../components/Loader";
import Button from "../components/Button";

const Result = () => {
  // We can get result info from navigation state (immediate) or fetch by ID (history)
  // The previous page navigates to /result/:quizId but passes result object in state.
  // If we want to support viewing deep link history, we might need a dedicated Route like /attempt/:attemptId.
  // Given the current setup, let's assume we show the immediate result passed via state.

  // Actually, good practice is to navigate to a unique result URL.
  // But since our route updates didn't explicitely include an Attempt View page for history,
  // I will use the state if available, otherwise assume the ID param is an Attempt ID if we implement history view later.
  // For now, let's keep it simple: Route is /result/:quizId (Contextual) OR usage of state.

  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    // Fallback or Redirect if accessed directly without taking quiz
    // In a real app, we'd fetch the user's last attempt for this quiz
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="mb-4 text-gray-600">No result data found.</p>
        <Link to="/quizzes">
          <Button>Go to Quizzes</Button>
        </Link>
      </div>
    );
  }

  const { result, quiz } = state;
  const { score, totalQuestions, passed, percentage } = result;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div
          className={`p-8 text-center ${passed ? "bg-green-50" : "bg-red-50"}`}
        >
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {passed ? (
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </h1>
          <p className="text-gray-600 mb-6">
            You have {passed ? "successfully passed" : "failed"} the{" "}
            <span className="font-semibold">{quiz.title}</span> quiz.
          </p>

          <div className="text-5xl font-extrabold text-gray-900 mb-2">
            {Math.round(percentage)}%
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Final Score
          </p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-b border-gray-100">
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">{score}</div>
            <div className="text-sm text-gray-500">Correct Answers</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalQuestions}
            </div>
            <div className="text-sm text-gray-500">Total Questions</div>
          </div>
        </div>

        <div className="p-8">
          {!quiz.isLive ? (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Review Answers
              </h3>
              <p className="text-sm text-blue-700">
                Since this quiz is no longer live, you can review the correct
                answers below (Feature coming soon in History view).
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Quiz is Live
              </h3>
              <p className="text-sm text-yellow-700">
                Correct answers are hidden while the quiz is still live for
                other candidates.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to="/quizzes" className="block">
              <Button className="w-full py-3">Explore More Quizzes</Button>
            </Link>
            <Link to="/" className="block">
              <Button variant="secondary" className="w-full py-3">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
