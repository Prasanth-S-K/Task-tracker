import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./src/db/connection.js";

import taskRoutes from "./src/routes/task.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import insightsRoutes from "./src/routes/insights.routes.js";
import { authMiddleware } from "./src/middleware/auth.middleware.js";

dotenv.config();

// 🧩 Initialize Database
initDB();

const app = express();

// ========================================
// 🌐 GLOBAL MIDDLEWARES
// ========================================
app.use(express.json());

// ✅ CORS Setup (allow frontend access)
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// ========================================
// 🧾 PUBLIC ROUTES
// ========================================
app.use("/auth", authRoutes);

// ========================================
// 🔐 PROTECTED ROUTES (JWT Required)
// ========================================
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/insights", authMiddleware, insightsRoutes);

// ========================================
// 🩺 HEALTH CHECK
// ========================================
app.get("/", (req, res) => {
  res.json({
    status: "✅ Task Tracker API running",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      tasks: "/tasks",
      insights: "/insights",
    },
  });
});

// ========================================
// 🚀 START SERVER
// ========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
