import express from "express";
import { getInsights } from "../services/insight.service.js";

const router = express.Router();

router.get("/", getInsights);

export default router;
