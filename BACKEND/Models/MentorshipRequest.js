const mongoose = require("mongoose");
require("./User"); 
const MentorshipRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MentorshipRequest", MentorshipRequestSchema);
