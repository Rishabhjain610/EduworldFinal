const express = require("express");
const Googlerouter = express.Router();
const { searchGoogle, askGemini } = require("../Controllers/GoogleSearch");

console.log("[GoogleSearchRoutes] loaded");

// POST /api/research - Google Search + Gemini Analysis
Googlerouter.post("/research", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "missing query" });

    // Step 1: Search Google
    console.log("🔍 Searching Google for:", query);
    const webResults = await searchGoogle(query, 5);

    // Step 2: Build context from search results
    const webContext =
      webResults.length > 0
        ? webResults
            .map(
              (r, i) => `${i + 1}. ${r.title}\n${r.snippet}\nSource: ${r.link}`
            )
            .join("\n\n")
        : "No web results found.";

    // Step 3: Ask Gemini to synthesize with its knowledge
    const prompt = `You are an AI research assistant. A user asked: "${query}"

Search results context:
${webContext}

Task: Synthesis these results into a clear summary. 
IMPORTANT RULES:
1. Do NOT use markdown symbols like asterisks (**), hashtags (#), or dashes for lists.
2. Do NOT use citations like [Source 1] or [1]. 
3. Use plain text only.
4. Provide a coherent 4-8 sentence paragraph.

Answer:`;

    console.log("🤖 Asking Gemini to synthesize...");
    const answer = await askGemini(prompt);

    return res.json({
      answer,
      sources: webResults.slice(0, 3), // Return top 3 sources for display
    });
  } catch (err) {
    console.error("research error", err);
    return res.status(500).json({ error: err.message || "research failed" });
  }
});

module.exports = Googlerouter;
