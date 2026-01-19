import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000" });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
            }`;
    }
    return req;
});

// Auth
export const signIn = (formData) => API.post("/api/auth/login", formData);
export const signUp = (formData) => API.post("/api/auth/register", formData);
export const googleLogin = (token) => API.post("/api/auth/google", { token });

// Questions
export const createQuestion = (newQuestion) => API.post("/api/questions", newQuestion);
export const fetchQuestions = () => API.get("/api/questions");
export const updateQuestion = (id, updatedQuestion) => API.patch(`/api/questions/${id}`, updatedQuestion);
export const deleteQuestion = (id) => API.delete(`/api/questions/${id}`);

// Quizzes
export const createQuiz = (newQuiz) => API.post("/api/quiz", newQuiz);
export const fetchQuizzes = (query) => {
    // query can be { category: '...', owner: true }
    // or we can just pass the query string manually or use axios params
    return API.get("/api/quiz", { params: query });
};
export const fetchQuiz = (id) => API.get(`/api/quiz/${id}`);
export const updateQuiz = (id, updatedQuiz) => API.patch(`/api/quiz/${id}`, updatedQuiz);
export const deleteQuiz = (id) => API.delete(`/api/quiz/${id}`);

// Attempts
export const startAttempt = (data) => API.post("/api/attempts/start", data);
export const submitAttempt = (attemptData) => API.post("/api/attempts", attemptData);
export const fetchAttempt = (id) => API.get(`/api/attempts/${id}`);
export const fetchUserAttempts = () => API.get("/api/attempts/user");

// Contact
export const submitContact = (contactData) => API.post("/api/contact", contactData);

// User
export const uploadProfileImage = (formData) => API.post("/api/user/profile-image", formData);
export const fetchUserProfile = () => API.get("/api/user/profile");
