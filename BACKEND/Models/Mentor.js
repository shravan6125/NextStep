const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔹 New Field for Authentication
  expertise: { type: String, required: true },
  experience: { type: Number, required: true }, // 🔹 New Field
  industry: { type: String, required: true },   // 🔹 New Field
  availability: { type: Boolean, default: true }
});



module.exports = mongoose.model("Mentor", MentorSchema);

