// // controllers/resumeController.js
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const axios = require("axios");
// const Resume = require("../Models/Resume");

// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// // Function to extract text from PDF
// const extractTextFromPDF = async (filePath) => {
//   const dataBuffer = fs.readFileSync(filePath);
//   const pdfData = await pdfParse(dataBuffer);
//   return pdfData.text;
// };

// // Function to analyze resume using Gemini
// const analyzeResume = async (req, res) => {
//   try {
//     const file = req.file;
//     const text = await extractTextFromPDF(file.path);

//     // Gemini API request
//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY},
//       {
//         contents: [{ parts: [{ text: Analyze this resume for a Software Engineer role. Score it out of 100 and suggest improvements:\n${text} }] }],
//       }`
//     );

//     const result = response.data.candidates[0].content.parts[0].text;
    
//     // Extract score and suggestions from result
//     const scoreMatch = result.match(/(\d{1,3})\/100/);
//     const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
//     const suggestions = result.split("\n").slice(1).filter((line) => line.trim());

//     // Save to database
//     const resume = new Resume({
//       fileName: file.originalname,
//       score,
//       suggestions,
//     });
//     await resume.save();

//     res.json({ score, suggestions });
//   } catch (error) {
//     res.status(500).json({ error: "Error analyzing resume" });
//   }
// };

// module.exports = { analyzeResume };


// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const axios = require("axios");
// const Resume = require("../Models/Resume");

// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// console.log("Using GEMINI_API_KEY:", GEMINI_API_KEY); // Debugging API Key


// // Function to extract text from PDF
// const extractTextFromPDF = async (filePath) => {
//   try {
//     const dataBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdfParse(dataBuffer);
//     return pdfData.text;
//   } catch (error) {
//     throw new Error("Error reading PDF file");
//   }
// };

// // Function to analyze resume using Gemini API
// const analyzeResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     console.log("File uploaded:", req.file.originalname);

//     // Extract text from PDF
//     const text = await extractTextFromPDF(req.file.path);
//     console.log("Extracted text from PDF:", text.substring(0, 200)); // Log first 200 characters

//     // Make a request to the Gemini API
//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `Analyze this resume for a Software Engineer role. Score it out of 100 and suggest improvements:\n${text}`
//               }
//             ]
//           }
//         ]
//       }
//     );

//     console.log("Gemini API response:", response.data);

//     // Extract result from Gemini response
//     const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
//     const scoreMatch = result.match(/(\d{1,3})\/100/);
//     const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
//     const suggestions = result.split("\n").slice(1).filter((line) => line.trim());

//     // Save analysis results in MongoDB
//     const resume = new Resume({
//       fileName: req.file.originalname,
//       score,
//       suggestions,
//     });
//     await resume.save();

//     res.json({ score, suggestions });
//   } catch (error) {
//     console.error("Error analyzing resume:", error.message);
//     res.status(500).json({ error: "Error analyzing resume" });
//   }
// };

// module.exports = { analyzeResume };



const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const axios = require("axios");
const Resume = require("../Models/Resume");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Function to extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } catch (error) {
    throw new Error("Error reading PDF file");
  }
};

// Function to extract text from DOCX
const extractTextFromDOCX = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
  } catch (error) {
    throw new Error("Error reading DOCX file");
  }
};

// Function to analyze resume using Gemini API
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File uploaded:", req.file.originalname);

    let text;
    if (req.file.mimetype === "application/pdf") {
      text = await extractTextFromPDF(req.file.path);
    } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      text = await extractTextFromDOCX(req.file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format. Please upload a PDF or DOCX." });
    }

    console.log("Extracted text from resume:", text.substring(0, 200)); // Show first 200 characters

    // Make request to Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze this resume for a Software Engineer role. Score it out of 100 and suggest improvements:\n${text}`
              }
            ]
          }
        ]
      }
    );

    console.log("Gemini API response:", response.data);

    // Extract result from Gemini response
    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
    const scoreMatch = result.match(/(\d{1,3})\/100/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    const suggestions = result.split("\n").slice(1).filter((line) => line.trim());

    // Save analysis results in MongoDB
    const resume = new Resume({
      fileName: req.file.originalname,
      score,
      suggestions,
    });
    await resume.save();

    res.json({ score, suggestions });
  } catch (error) {
    console.error("Error analyzing resume:", error.message);
    res.status(500).json({ error: "Error analyzing resume" });
  }
};

module.exports = { analyzeResume };
