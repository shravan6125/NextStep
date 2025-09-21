const Mentor = require("../Models/Mentor");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


//  Mentor Signup
exports.signupMentor = async (req, res) => {
  try {
    console.log("📡 Mentor Signup Request Received:", req.body);

    const { name, email, password, expertise, experience, industry } = req.body;

    // Check if required fields are missing
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ error: "Mentor already exists" });
    }

    // Save new mentor
    const newMentor = new Mentor({ name, email, password, expertise, experience, industry });
    await newMentor.save();

    console.log(" Mentor Signed Up:", newMentor);
    res.status(201).json({ message: "Mentor signed up successfully", mentorId: newMentor._id });

  } catch (error) {
    console.error("❌ Error in Mentor Signup:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
}; 


const bcrypt = require("bcryptjs");
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

exports.signinMentor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
      return res.status(400).json({ error: "Mentor not found" });
    }

    if (mentor.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    //  Send back mentorId in response
    res.json({ status: "Logged in successfully", mentorId: mentor._id });
  } catch (error) {
    res.status(500).json({ error: error.message });fb 
  }
};

exports.getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ availability: true });
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getMentorDetails = async (req, res) => {
  try {
    const { mentorId } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: "Invalid mentor ID format" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
