import genAI from "./gemini.ai.js";
import fs from "fs";

export const extractTextFromImage = async (image) => {
  try {
    // For Google Generative AI, we need to convert the image to a specific format
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Read image file
    const imageData = fs.readFileSync(image.path);
    const imageBase64 = imageData.toString("base64");

    // Construct the image part
    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: image.mimetype,
        },
      },
    ];

    const prompt = `Analyze this image and extract between 1 to 3 most prominent professional/technical skills visible in the text.
      Your response should be a comma-separated list of skills (e.g., "JavaScript, React, Node.js").
    Each skill should be a single word or a common multi-word skill term (like "Machine Learning").
    Focus on technical or professional skills that would be relevant for a resume or job profile.
    Only include the skills, no explanations or other text.`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const skillsText = response.text().trim();
    const skills = skillsText
      .split(",") // Split by commas
      .map((skill) => skill.trim()) // Trim whitespace
      .filter((skill) => skill.length > 0) // Remove empty entries
      .slice(0, 3); // Take maximum 3 skills

    return skills.length > 0 ? skills : [];
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw new Error(error);
  }
};
