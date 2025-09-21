
const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require('../models/user');

// Get course recommendations for a user
router.post('/recommend', async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find courses matching user skills & interests
    const recommendedCourses = await Course.find({
        $or: [
            { skills: { $in: user.skills } },  
            { title: { $regex: new RegExp(user.interests.join("|"), "i") } } 
        ]
    }).sort({ rating: -1 });  

    res.json(recommendedCourses);
});

module.exports = router;

const natural = require('natural');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

async function recommendCourses(userId) {
    const user = await User.findById(userId);
    if (!user) return [];

    const courses = await Course.find({});
    
    courses.forEach(course => tfidf.addDocument(course.description));

    let rankedCourses = courses.map(course => {
        let score = tfidf.tfidf(user.skills.join(" "), course.description);
        return { course, score };
    });

    rankedCourses.sort((a, b) => b.score - a.score);
    return rankedCourses.map(item => item.course);
}

