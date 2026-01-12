import axios from "axios";

const API = axios.create({ baseURL: "https://mindmania-backend.onrender.com" });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
            }`;
    }
    return req;
});

export const signIn = (formData) => API.post("/api/auth/login", formData);
export const signUp = (formData) => API.post("/api/auth/register", formData);
export const createQuiz = (newQuiz) => API.post("/api/quiz", newQuiz);
export const fetchQuizzes = () => API.get("/api/quiz");
export const submitContact = (contactData) => API.post("/api/contact", contactData);
