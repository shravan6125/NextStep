const express = require("express");
const { askCareerBot } = require("../controllers/chatbotController");

const router = express.Router();
router.post("/chat", askCareerBot);

module.exports = router;
