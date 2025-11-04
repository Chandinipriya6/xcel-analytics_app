// server/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    tableName: { type: String },
    chartType: { type: String },
    dimension: { type: String },
    summary: { type: String },
    dataRows: { type: Array }, // store raw rows if needed
    fields: { type: Array },   // store field names
    xAxis: { type: String },
    yAxis: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
