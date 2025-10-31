import express from "express";
import { createTask, getTasks, updateTask } from "../services/task.service.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id", updateTask);

export default router;
