const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");
const { ensureAuthenticated } = require("../middleware/auth"); // auth check
const analysisController = require('../controllers/analysisController');

// Save analysis
router.post("/save", ensureAuthenticated, async (req, res) => {
  try {
    const {
      tableName,
      fileName,
      description,
      fields,
      dataRows,
      xAxis,
      yAxis,
      chartType,
      dimension
    } = req.body;

    const newAnalysis = new Analysis({
      user: req.user._id,
      tableName,
      fileName,
      description,
      fields,
      dataRows,
      xAxis,
      yAxis,
      chartType,
      dimension
    });

    await newAnalysis.save();
    res.status(201).json({ message: "Analysis saved successfully" });
  } catch (error) {
    console.error("Error saving analysis:", error);
    res.status(500).json({ error: "Failed to save analysis" });
  }
});

// Get all saved analyses for logged-in user
router.get("/history", ensureAuthenticated, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Get a single analysis by ID
router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id
    }).lean();

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }
    res.json(analysis);
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

// Delete an analysis by ID 
router.delete("/:id", ensureAuthenticated, analysisController.deleteAnalysis);
// Add ensureAuthenticated here 

router.post('/summary', ensureAuthenticated, analysisController.getSummary);


module.exports = router;
