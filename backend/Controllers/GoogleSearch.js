const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Google Custom Search API
async function searchGoogle(query, num = 5) {
  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CX) {
    throw new Error("Missing GOOGLE_API_KEY or GOOGLE_CX");
  }
  
  const url = "https://www.googleapis.com/customsearch/v1";
  const params = {
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_CX,
    q: query,
    num,
  };
  
  try {
    const resp = await axios.get(url, { params, timeout: 15000 });
    return (resp.data.items || []).map(it => ({
      title: it.title,
      link: it.link,
      snippet: it.snippet,
    }));
  } catch (err) {
    console.error("Google Search API error:", err?.response?.data || err.message);
    return [];
  }
}

// Gemini AI
async function askGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY env var");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return String(text);
  } catch (err) {
    console.error("Gemini API error:", err.message || err);
    throw err;
  }
}

module.exports = { searchGoogle, askGemini };