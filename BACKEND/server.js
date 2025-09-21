
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const axios = require("axios");




//  Import Models & Services
const getCareerRoadmap = require("./aiService");
const Chat = require("./Models/Chat");
const Mentor = require("./Models/Mentor");
const User = require("./Models/User");



//  Import Routes
const authRoutes = require("./routes/authRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const requestRoutes = require("./routes/requestRoutes");
const chatRoutes = require("./routes/chatRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

//  Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

//  Create HTTP Server (for WebSockets)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend connections
    methods: ["GET", "POST"],
  },
});

//  Middleware
app.use(express.json());
app.use(cors());

//  Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" Database Connected Successfully"))
  .catch((e) => console.log(" Database Connection Failed:", e));

//  Root Route
app.get("/", (req, res) => res.send(" Career Guidance Backend Running!"));

//  API Routes
app.use("/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/chatbot", chatbotRoutes);

//  AI Career Roadmap Generation
app.post("/generate-roadmap", async (req, res) => {
  try {
    const roadmap = await getCareerRoadmap(req.body);
    res.json(roadmap);
  } catch (error) {
    console.error(" Error Generating Roadmap:", error);
    res.status(500).json({ error: "Failed to generate roadmap." });
  }
});

//  WebSocket: Real-Time Chat System
const users = {}; // Track online users

io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  socket.on("join", ({ userId }) => {
    users[userId] = socket.id;
    console.log(` User ${userId} joined with socket ${socket.id}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      console.log(" Incoming message data:", data); //  Debug log
  
      const { senderId, receiverId, message } = data;
  
      //  Check for missing fields
      if (!senderId || !receiverId || !message) {
        console.error(" Error: senderId, receiverId, or message is missing.");
        return;
      }
  
      //  Determine receiverType (User or Mentor)
      let receiverType = "User"; // Default
      const mentor = await Mentor.findById(receiverId);
      if (mentor) {
        receiverType = "Mentor";
      }
  
      //  Save message in MongoDB
      const chat = new Chat({ senderId, receiverId, receiverType, message });
      await chat.save();
      console.log(" Message saved:", chat);
  
      //  Send message in real-time
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
      }
    } catch (error) {
      console.error(" Error Saving Chat:", error);
    }
  });
  
  socket.on("disconnect", () => {
    console.log(" A user disconnected:", socket.id);
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

//  Start Server
server.listen(PORT, "0.0.0.0", () => console.log(` Server running on http://localhost:${PORT}`));
