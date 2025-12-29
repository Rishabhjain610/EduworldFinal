const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const axios = require("axios");
async function generateContent(prompt) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `"You are an expert code reviewer with extensive software development experience.",
        "Analyze the provided code snippet for readability and maintainability, identifying any confusing or overly complex sections.",
       "Assess the code for adherence to best practices and coding standards.",
        "Detect any logical errors or bugs within the code.",
         "Provide clear, concise, and actionable feedback to improve the code quality.",
         "As an expert code reviewer, I've analyzed the provided JavaScript snippet.

Code Review Feedback   this line should be removed."
       "Limit the review to 50 lines of code."
        the code given below is ${prompt}`,
  });
  return result.text;
}

const aiResponse = async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }
  const response = await generateContent(prompt);

  res.send(response);
};
const executeCode = async (req, res) => {
  const { script, language, version } = req.body;

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.CLIENT_ID_JDOODLE,
      clientSecret: process.env.CLIENT_SECRET_JDOODLE,
      script: script,
      language: language,
      versionIndex: version,
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error executing code via JDoodle:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to execute code." });
  }
};

module.exports = { aiResponse, executeCode };
