// models/Resume.js
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  fileName: String,
  score: Number,
  suggestions: [String],
});

module.exports = mongoose.model("Resume", resumeSchema);