import ai from "../config/gemini.js";

import StudentProfile
from "../models/studentProfile.model.js";

import { buildCareerPrompt }
from "../prompts/careerPrompt.js";

export const askCareerAI = async (
    userId,
    message
) => {

    const student =
    await StudentProfile
    .findOne({
        user:userId
    })
    .populate(
        "user",
        "name email"
    );

    if(!student){

        throw new Error(
            "Student profile not found"
        );

    }

    const prompt =
    buildCareerPrompt(
        student,
        message
    );

    const response =
    await ai.models.generateContent({

      model: "gemini-3.1-flash-lite",

        contents:prompt

    });

    return response.text;

};