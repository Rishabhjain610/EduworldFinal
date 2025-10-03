const { generateContent } = require("../Services/aiService");
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
