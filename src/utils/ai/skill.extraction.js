import genAI from "./gemini.ai.js";

export const extractSkillsFromText = async (text) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 1,
      topK: 1,
      maxOutputTokens: 50,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  });

  const prompt = `
    Analyze the following text and extract up to 3 most relevant skills mentioned.
    Your response should be a comma-separated list of skills (e.g., "JavaScript, React, Node.js").
    Each skill should be a single word or a common multi-word skill term (like "Machine Learning").
    Focus on technical or professional skills that would be relevant for a resume or job profile.
    Only include the skills, no explanations or other text.
    
    Text: ${text}
    
    Skills:
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const skillsText = response.text().trim();

    // Process the response into an array of skills
    const skills = skillsText
      .split(",") // Split by commas
      .map((skill) => skill.trim()) // Trim whitespace
      .filter((skill) => skill.length > 0) // Remove empty entries
      .slice(0, 3); // Take maximum 3 skills

    return skills.length > 0 ? skills : [];
  } catch (error) {
    console.error("Error extracting skills:", error);
    throw new Error(error);
  }
};
