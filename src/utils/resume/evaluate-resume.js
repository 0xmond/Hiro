import axios from "axios";

export async function evaluateResume(resumeText, jobDescription) {
  const prompt = `
  Evaluate the following resume against the job description.
  
  Job Description:
  ${jobDescription}
  
  Resume:
  ${resumeText}
  
  Provide a structured JSON response with the following format:
  {
    "match_percentage": integer (0-100),
    "missing_skills": list of strings,
    "strengths": list of strings,
    "improvements": list of strings
  }
  
  Only return valid JSON. Do not include any other text or explanation.
  `;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }
  );

  const rawText =
    response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Remove code blocks and parse JSON
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
