// server/routes/insights.js
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

router.post("/generate-graph-insight", async (req, res) => {
  try {
    const { graphData } = req.body;

    if (!graphData) {
      return res.status(400).json({ error: "graphData is required" });
    }

    const prompt = `
      You are analyzing the following graph data: ${JSON.stringify(graphData).slice(0, 1000)}.
      Please provide:
      1. A short summary of what the graph shows.
      2. Any noticeable trends or anomalies.
      3. One actionable insight that a business/analyst could use.
    `;

    // ✅ Use Gemini SDK
    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    res.json({ insight: aiText });
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    res.status(500).json({ error: "Failed to generate graph insights" });
  }
});

module.exports = router;
