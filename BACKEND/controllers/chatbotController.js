const axios = require("axios");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const askCareerBot = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Please provide a question." });
    }

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: `Answer this career guidance question: ${question}` }] }],
      }
    );

    const botResponse = response.data.candidates[0].content.parts[0].text;
    
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
};

module.exports = { askCareerBot };
