// server/models/Analysis.js
const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tableName: { type: String },
  fileName: { type: String },
  description: { type: String },
  fields: [{ type: String }],            // header row
  dataRows: { type: Array, default: [] },// array of arrays: each row
  xAxis: { type: String },
  yAxis: { type: String },
  chartType: { type: String },
  dimension: { type: String, default: '2D' }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);
