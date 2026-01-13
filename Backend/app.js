import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import requestLogger from "./middleware/requestLogger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

const CONNECTION_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/quiz-platform";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: CONNECTION_URL,
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Quiz API running...");
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
