import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000" });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
            }`;
    }
    return req;
});

export const signIn = (formData) => API.post("/api/auth/login", formData);
export const signUp = (formData) => API.post("/api/auth/register", formData);
export const googleLogin = (token) => API.post("/api/auth/google", { token });
export const createQuiz = (newQuiz) => API.post("/api/quiz", newQuiz);
export const fetchQuizzes = () => API.get("/api/quiz");
export const submitContact = (contactData) => API.post("/api/contact", contactData);
