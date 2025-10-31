import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./src/db/connection.js";

import taskRoutes from "./src/routes/task.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import insightsRoutes from "./src/routes/insights.routes.js";
import { authMiddleware } from "./src/middleware/auth.middleware.js";

dotenv.config();

// Initialize Database
initDB();

const app = express();

// GLOBAL MIDDLEWARES

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// CORS Setup
app.use(
  cors({
    origin: ["http://localhost:5173", "https://task-tracker.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// PUBLIC ROUTES

app.use("/auth", authRoutes);

// PROTECTED ROUTES

app.use("/tasks", authMiddleware, taskRoutes);
app.use("/insights", authMiddleware, insightsRoutes);

// HEALTH CHECK

app.get("/", (req, res) => {
  res.json({
    status: "Task Tracker API running",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      tasks: "/tasks",
      insights: "/insights",
    },
  });
});

// START SERVER

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
