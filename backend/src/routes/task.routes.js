import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/task.service.js";

const router = express.Router();

//  Create new task
router.post("/", createTask);

//  Get all tasks (with optional filters)
router.get("/", getTasks);

//  Update task by UUID
router.patch("/:uuid", updateTask);

//  Delete task by UUID
router.delete("/:uuid", deleteTask);

router.get("/status", (req, res) => {
  res.json({ message: "Task routes active and JWT-protected" });
});

export default router;
