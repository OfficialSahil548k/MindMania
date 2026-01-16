import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../api/axios";
import Button from "../components/Button";
import Input from "../components/Input";

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: "",
    type: "MCQ",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "Medium",
    tags: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process tags
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      await createQuestion({
        ...formData,
        tags: tagsArray,
      });

      // Redirect back to dashboard or clear form?
      // Let's ask user. For now, redirect.
      navigate("/instructor-dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to create question");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Question
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              name="text"
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              value={formData.text}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="True/False">True / False</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {formData.type === "MCQ" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              {formData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer (Must match an option exactly)
            </label>
            <select
              name="correctAnswer"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.correctAnswer}
              onChange={handleChange}
            >
              <option value="">Select Correct Answer</option>
              {formData.type === "MCQ" ? (
                formData.options.map(
                  (opt, i) =>
                    opt && (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    )
                )
              ) : (
                <>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </>
              )}
            </select>
          </div>

          <Input
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. Math, Algebra, 10th Grade"
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/instructor-dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit">Save Question</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
