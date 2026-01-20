import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchQuestions,
  fetchQuiz,
  updateQuiz,
  createQuestion,
  fetchInstitutes,
} from "../api/axios";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "MCQ",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "Medium",
  });

  // Form State
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    category: "",
    timeLimit: 10,
    passingScore: 50,
    isLive: true,
    questions: [], // Array of IDs
    institute: "", // Institute ID
  });
  const [institutes, setInstitutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, questionsRes] = await Promise.all([
          fetchQuiz(id),
          fetchQuestions(),
          fetchInstitutes(),
        ]);

        const quiz = quizRes.data;
        // Map backend data to form state
        setQuizData({
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          isLive: quiz.isPublished || quiz.isLive, // Handle both flags
          questions: quiz.questions.map((q) => q._id || q), // Handle populated or unpopulated
          institute: quiz.institute || "",
        });

        setAvailableQuestions(questionsRes.data);
        setInstitutes(institutesRes.data);
      } catch (error) {
        console.error("Error loading data", error);
        toast.error("Failed to load quiz data.");
        navigate("/quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setQuizData({ ...quizData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map isLive back to isPublished
      await updateQuiz(id, { ...quizData, isPublished: quizData.isLive });
      toast.success("Quiz updated successfully!");
      navigate(`/quizzes`); // Or back to dashboard
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quiz");
    }
  };

  const toggleQuestionSelection = (questionId) => {
    const currentSelected = quizData.questions;
    if (currentSelected.includes(questionId)) {
      setQuizData({
        ...quizData,
        questions: currentSelected.filter((id) => id !== questionId),
      });
    } else {
      setQuizData({ ...quizData, questions: [...currentSelected, questionId] });
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
      setAvailableQuestions([...availableQuestions, data]);
      setQuizData({
        ...quizData,
        questions: [...quizData.questions, data._id],
      });
      setIsQuestionModalOpen(false);
      setNewQuestion({
        text: "",
        type: "MCQ",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "Medium",
      });
    } catch (error) {
      console.error("Failed to create question", error);
      toast.error("Failed to create question. Please check all fields.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden relative">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
            <Button variant="secondary" onClick={() => navigate("/quizzes")}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Input
                label="Quiz Title"
                name="title"
                value={quizData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Introduction to React"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  value={quizData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Category"
                  name="category"
                  value={quizData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Web Development"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute (Optional)
                  </label>
                  <select
                    name="institute"
                    value={quizData.institute}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                  >
                    <option value="">Select Institute (Default: None)</option>
                    {institutes.map((inst) => (
                      <option key={inst._id} value={inst._id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Time Limit (Minutes)"
                  type="number"
                  name="timeLimit"
                  value={quizData.timeLimit}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Passing Score (%)"
                  type="number"
                  name="passingScore"
                  value={quizData.passingScore}
                  onChange={handleChange}
                  required
                />
                <div className="flex items-center h-full pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isLive"
                      checked={quizData.isLive}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-gray-900 font-medium">
                      Publish Immediately (Live)
                    </span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Questions
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Selected: {quizData.questions.length} /{" "}
                      {availableQuestions.length}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsQuestionModalOpen(true)}
                    >
                      + New Question
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
                  {availableQuestions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No questions available.
                    </div>
                  ) : (
                    availableQuestions.map((q) => (
                      <div
                        key={q._id}
                        className={`p-4 cursor-pointer hover:bg-orange-50 transition-colors flex gap-4 ${
                          quizData.questions.includes(q._id)
                            ? "bg-orange-50"
                            : ""
                        }`}
                        onClick={() => toggleQuestionSelection(q._id)}
                      >
                        <input
                          type="checkbox"
                          checked={quizData.questions.includes(q._id)}
                          readOnly
                          className="mt-1 w-5 h-5 text-primary rounded"
                        />
                        <div>
                          <p className="text-gray-900 font-medium">{q.text}</p>
                          <div className="flex gap-2 mt-1 text-xs text-gray-500">
                            <span>{q.type}</span> •<span>{q.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </div>

        {/* Reuse the Question Modal from CreateQuiz (copied here for simplicity) */}
        {isQuestionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Add Question</h2>
                <button
                  type="button"
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
                          ),
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
                  <Button type="submit">Save & Select</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditQuiz;
