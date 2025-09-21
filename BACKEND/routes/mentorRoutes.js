const express = require("express");
const mentorController = require("../controllers/mentorController");

const router = express.Router();

//  Mentor Authentication Routes
router.post("/signup", mentorController.signupMentor);
router.post("/signin", mentorController.signinMentor);

// Other Mentor Routes (Same as Before)

const Router = express.Router();

router.get("/", mentorController.getMentors);
const { getMentorDetails } = require("../controllers/mentorController");



// Route: GET Mentor Details by ID
router.get("/:mentorId", getMentorDetails);

module.exports = router;

