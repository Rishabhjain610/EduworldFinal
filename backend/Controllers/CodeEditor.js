const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generateContent(prompt) {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `"You are an expert code reviewer with extensive software development experience.",
        "Analyze the provided code snippet for readability and maintainability, identifying any confusing or overly complex sections.",
       "Assess the code for adherence to best practices and coding standards.",
        "Detect any logical errors or bugs within the code.",
         "Provide clear, concise, and actionable feedback to improve the code quality.",
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
  console.log(response);
  res.send(response);
};

module.exports = { aiResponse };