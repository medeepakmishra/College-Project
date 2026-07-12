import express from "express";

import { chatWithAI , analyzeResumeAI} from "../controller/ai.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { buildCareerPrompt } from "../prompts/promptBuilder.js";

const router = express.Router();

router.post("/chat", protect, chatWithAI);
router.post(
  "/analyze-resume",
  protect,
  analyzeResumeAI
);

export default router;
