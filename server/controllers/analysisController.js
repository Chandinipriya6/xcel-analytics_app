// server/controllers/analysisController.js
const Analysis = require('../models/Analysis');

exports.saveAnalysis = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const {
      tableName, fileName, description,
      fields, dataRows, xAxis, yAxis, chartType, dimension
    } = req.body;

    const analysis = new Analysis({
      user: userId,
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

    await analysis.save();
    return res.status(201).json({ message: 'Saved', analysisId: analysis._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const items = await Analysis.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAnalysis = async (req,res) =>{
  try{
       const userId=req.user && req.user._id;
       if(!userId) return res.status(401).json({message:'Unauthorized'});

       const {id} = req.params;
       const deleted = await Analysis.findOneAndDelete({_id : id, user: userId});
      
       if(!deleted){
        return res.status(404).json({message:'Analysis is not found'});
       }
       return res.json({message:'Analysis deleted successfully'});
  }catch(err){
    console.error("Delete error:",err);
    return res.status(500).json({message:'Server error'});
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const analysis = await Analysis.findOne({ _id: id, user: userId }).lean();
    if (!analysis) return res.status(404).json({ message: 'Not found' });
    return res.json(analysis);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { analysisId } = req.body;

    if (!analysisId) {
      return res.status(400).json({ message: 'Missing analysisId' });
    }

    // Fetch analysis from DB
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const { fields, dataRows, xAxis, yAxis } = analysis;

    let graphData = [];
    if (Array.isArray(dataRows) && dataRows.length > 0) {
      const xIndex = fields.indexOf(xAxis);
      const yIndex = fields.indexOf(yAxis);

      if (xIndex !== -1 && yIndex !== -1) {
        graphData = dataRows.map(row => ({
          x: row[xIndex],
          y: row[yIndex]
        }));
      }
    }

    // Generate summary based on graphData
    let summary = "Summary: ";
    if (graphData.length > 0) {
      const values = graphData.map(d => d.y ?? 0);
      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

      summary += `Values range from ${min} to ${max}, with an average of ${avg}.`;
    } else {
      summary += "No data points to summarize.";
    }

    return res.json({ summary });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
