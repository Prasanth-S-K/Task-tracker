import express from "express";
import { getInsights } from "../services/insight.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getInsights);

export default router;
