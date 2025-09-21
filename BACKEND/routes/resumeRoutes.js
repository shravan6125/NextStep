// routes/resumeRoutes.js
const express = require("express");
const multer = require("multer");
const { analyzeResume } = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("resume"), analyzeResume);

module.exports = router;