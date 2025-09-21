const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, refPath: "receiverType", required: true },
    receiverType: { type: String, enum: ["User", "Mentor"], required: true }, 
    message: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Chat", chatSchema);




