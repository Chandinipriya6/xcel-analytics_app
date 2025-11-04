const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  filename: String,
  size: Number, // in bytes
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Upload", uploadSchema);