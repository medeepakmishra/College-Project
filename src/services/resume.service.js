import ai from "../config/gemini.js";

import StudentProfile from "../models/studentProfile.model.js";

import { extractPdfText } from "../utils/pdfParser.js";

import { buildResumePrompt } from "../prompts/resumePrompt.js";
export const analyzeResume = async (userId) => {
  // Fetch student profile
  const student = await StudentProfile.findOne({
    user: userId,
  }).populate("user", "name email");

  if (!student) {
    throw new Error("Student profile not found");
  }

  if (!student.resume) {
    throw new Error("Resume not uploaded");
  }

  // Extract text from resume
  // const resumeText = await extractPdfText(student.resume);
  const resumeText = await extractPdfText(
    student.resume.url
);

  // Build AI prompt
  const prompt = buildResumePrompt(student, resumeText);

  // Ask Gemini
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

 const text = response.text;

const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

  // Gemini returns JSON as text
  try {
    return JSON.parse(text);
  } catch (err) {
    console.log("Gemini returned invalid JSON");

    return JSON.parse(cleaned);
  }
};
