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
  "User Testing",
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
  "AWS SageMaker",
  "Google AI Platform",
  "Azure ML",
  "MLOps",
  "Algorithm Design",
  "Statistics",
];
    
    Text: ${text}
    
    Skills:
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
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
