// server/routes/summaries.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { getGraphInsights } = require("./geminiService");

// ✅ Example: Fetch all summaries
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
});

// ✅ Example: Create new summary
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: "Failed to create summary" });
  }
});

// ✅ Call Gemini service for graph insights
router.post("/graph-insights", async (req, res) => {
  try {
    const { summary } = req.body; // send summary from frontend
    const insights = await getGraphInsights(summary);

    res.json({ summary, insights });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

module.exports = router;
