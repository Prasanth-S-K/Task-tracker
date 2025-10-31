import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import tasksRouter from "./src/routes/tasks.router.js";
import { initDB } from "./src/db/connection.js";
import insightsRouter from "./src/routes/insights.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/insights", insightsRouter);

initDB();

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("Task Tracker Backend is running");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
