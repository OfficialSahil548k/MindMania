import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchQuizzes,
  fetchQuestions,
  deleteQuiz,
  deleteQuestion,
  createQuestion,
} from "../api/axios";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";

const InstructorDashboard = () => {
  const { userId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quizzes"); // quizzes or questions

  // Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "MCQ",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "Medium",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const quizzesRes = await fetchQuizzes({ owner: true });
      const questionsRes = await fetchQuestions();
      setQuizzes(quizzesRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(id);
        setQuizzes(quizzes.filter((q) => q._id !== id));
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        setQuestions(questions.filter((q) => q._id !== id));
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  // New Question Logic
  const handleNewQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createQuestion(newQuestion);
      // Add new question to list
      setQuestions([...questions, data]);
      setIsQuestionModalOpen(false);
      // Reset form
      setNewQuestion({
        text: "",
        type: "MCQ",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "Medium",
      });
    } catch (error) {
      console.error("Failed to create question", error);
      alert("Failed to create question. Please check all fields.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <div className="flex gap-4">
            <Link to="/quizzes">
              <Button variant="outline">View All Quizzes</Button>
            </Link>
            {/* Replaced Link with Button to open Modal */}
            <Button
              variant="secondary"
              onClick={() => setIsQuestionModalOpen(true)}
            >
              + Add Question
            </Button>
            <Link to={`/${userId}/create-quiz`}>
              <Button>+ Create Quiz</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "quizzes"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("quizzes")}
            >
              Quizzes ({quizzes.length})
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "questions"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("questions")}
            >
              Question Bank ({questions.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === "quizzes" ? (
              <div className="space-y-4">
                {quizzes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No quizzes created yet.
                  </p>
                ) : (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:border-orange-200 transition-colors bg-gray-50"
                    >
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {quiz.questions.length} Questions • {quiz.category} •{" "}
                          {quiz.isLive ? (
                            <span className="text-green-600 font-medium">
                              Live
                            </span>
                          ) : (
                            <span className="text-gray-400">Draft</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {/* Edit button placeholder */}
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                          className="text-sm px-3 py-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No questions in the bank.
                  </p>
                ) : (
                  questions.map((question) => (
                    <div
                      key={question._id}
                      className="p-4 border rounded-lg hover:border-orange-200 transition-colors bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 mb-2">
                            {question.text}
                          </p>
                          <div className="flex gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {question.type}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded ${
                                question.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800"
                                  : question.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {question.difficulty}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="text-sm px-2 py-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question Creation Modal */}
        {isQuestionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Add Question</h2>
                <button
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreateQuestion} className="p-6 space-y-4">
                <Input
                  label="Question Text"
                  name="text"
                  value={newQuestion.text}
                  onChange={handleNewQuestionChange}
                  required
                  autoFocus
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={newQuestion.type}
                      onChange={handleNewQuestionChange}
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="True/False">True/False</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Difficulty
                    </label>
                    <select
                      name="difficulty"
                      value={newQuestion.difficulty}
                      onChange={handleNewQuestionChange}
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                {newQuestion.type === "MCQ" ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Options</label>
                    {newQuestion.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        className="w-full border rounded-lg p-2"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        required
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Options</label>
                    <div className="grid grid-cols-2 gap-2 text-center text-sm bg-gray-50 p-2 rounded">
                      <div>True</div>
                      <div>False</div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Correct Answer (Exact Match)
                  </label>
                  {newQuestion.type === "MCQ" ? (
                    <select
                      name="correctAnswer"
                      value={newQuestion.correctAnswer}
                      onChange={handleNewQuestionChange}
                      required
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="">Select Correct Option</option>
                      {newQuestion.options.map(
                        (opt, idx) =>
                          opt && (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          )
                      )}
                    </select>
                  ) : (
                    <select
                      name="correctAnswer"
                      value={newQuestion.correctAnswer}
                      onChange={handleNewQuestionChange}
                      required
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="">Select Correct Option</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setIsQuestionModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save & Close</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
