const Chat = require("../Models/Chat");
const Mentor = require("../Models/Mentor");

exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        //  Check if the receiver is a Mentor or a User
        let receiverType = "User";
        const mentor = await Mentor.findById(receiverId);
        if (mentor) {
            receiverType = "Mentor";
        }

        //  Save message in MongoDB
        const chat = new Chat({ senderId, receiverId, receiverType, message });
        await chat.save();

        res.status(201).json(chat);
    } catch (error) {
        console.error(" Error Sending Message:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { userId, mentorId } = req.params;
        const messages = await Chat.find({
            $or: [
                { senderId: userId, receiverId: mentorId },
                { senderId: mentorId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error(" Error Fetching Messages:", error);
        res.status(500).json({ error: error.message });
    }
};
