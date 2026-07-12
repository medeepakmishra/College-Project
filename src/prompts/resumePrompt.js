export const buildResumePrompt = (
  student,
  resumeText
) => {

return `

You are an expert ATS (Applicant Tracking System) Resume Reviewer.

Analyze the following student's resume professionally.

------------------------------------------------

Student Information

Name:
${student.user.name}

Department:
${student.department}

Course:
${student.course}

Semester:
${student.semester}

CGPA:
${student.cgpa}

Skills:
${student.skills.join(", ")}

------------------------------------------------

Resume

${resumeText}

------------------------------------------------

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT wrap JSON inside \`\`\`.

Return ONLY this structure:

{
  "atsScore": 0,
  "placementReadiness": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "grammarIssues": [],
  "recommendations": [],
  "bestCompanies": []
}

`;

};