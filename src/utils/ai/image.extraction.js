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
    Only include the skills, no explanations or other text. And the skills must be included in the following array: [
  "JavaScript",
  "TypeScript",
  "React",
  "HTML5",
  "CSS3",
  "Flexbox",
  "CSS Grid",
  "Tailwind CSS",
  "Bootstrap",
  "SASS",
  "Webpack",
  "Babel",
  "Vue.js",
  "Angular",
  "Responsive Design",
  "Web Accessibility (a11y)",
  "Web Performance Optimization",
  "SEO",
  "Figma",
  "Prototyping",
  "Jest",
  "Cypress",
  "Selenium",
  "Puppeteer",
  "Node.js",
  "Express.js",
  "RESTful APIs",
  "GraphQL",
  "Python",
  "Java",
  "C#",
  "Go",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Sequelize",
  "Mongoose",
  "Entity Framework",
  "Microservices architecture",
  "Serverless architecture",
  "Docker",
  "Kubernetes",
  "Terraform",
  "AWS",
  "Google Cloud Platform (GCP)",
  "Microsoft Azure",
  "CI/CD",
  "Git",
  "API Gateway",
  "OAuth",
  "JWT",
  "CloudFormation",
  "Azure Functions",
  "Monitoring & Logging",
  "Prometheus",
  "Datadog",
  "Python",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "SciPy",
  "OpenCV",
  "NLP",
  "spaCy",
  "Hugging Face Transformers",
  "NLTK",
  "Gensim",
  "XGBoost",
  "Data Mining",
  "Big Data",
  "Spark",
  "Hadoop",
  "ETL",
  "Data Warehousing",
  "Data Visualization",
  "Tableau",
  "Power BI",
  "Model Deployment",
  "FastAPI",
  "Flask",
  "Docker",
  "Azure ML",
  "MLOps",
  "Algorithm Design",
  "Statistics",
]`;

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
