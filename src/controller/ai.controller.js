import { askCareerAI } from "../services/ai.service.js";
import { analyzeResume } from "../services/resume.service.js";

// ===========================
// AI CHAT
// ===========================
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await askCareerAI(
      req.user._id,
      message
    );

    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// AI RESUME ANALYZER
// ===========================
export const analyzeResumeAI = async (req, res) => {
  try {

    const analysis = await analyzeResume(req.user._id);

    return res.status(200).json({
      success: true,
      analysis,
    });

  } catch (error) {

    console.error("Resume AI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};