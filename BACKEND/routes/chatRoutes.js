
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

//  Route to send a message
router.post("/send", chatController.sendMessage);

//  Route to get messages between two users
router.get("/:userId/:mentorId", chatController.getMessages);

module.exports = router;
