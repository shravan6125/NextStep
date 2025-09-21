
require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;

async function getCareerRoadmap(userAnswers) {
    if (!API_KEY) {
        throw new Error("Missing Gemini API Key. Check your .env file.");
    }

    const prompt = `
    I am a ${userAnswers.education} interested in ${userAnswers.interest}. My favorite subject is ${userAnswers.subject}, and my career goal is ${userAnswers.careerGoal}. The most important factor for me when choosing a career is ${userAnswers.factor}. I prefer to work ${userAnswers.workStyle}.
    Can you provide career roadmap that 
    gives description 
    I want a structured, actionable plan to achieve my goals."
    `;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );
        console.log("Full API Response:", JSON.stringify(response.data, null, 2));


        // Extract roadmap text
        const roadmapText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No roadmap generated.";

        return { roadmap: roadmapText }; // Return structured response
    } catch (error) {
        console.error("Error Response:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        return { error: "Failed to generate career roadmap.", details: error.response ? error.response.data : error.message };
    }
}

module.exports = getCareerRoadmap;
