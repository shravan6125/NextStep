const mongoose = require('mongoose');
const fs = require('fs');
const Course = require('./models/course');

mongoose.connect('mongodb://localhost:27017/nextstep', {
    useNewUrlParser: true, useUnifiedTopology: true
});

// Load JSON and insert into MongoDB
async function importCourses() {
    const courses = JSON.parse(fs.readFileSync('courses.json', 'utf-8'));
    await Course.insertMany(courses);
    console.log("Courses imported successfully!");
    mongoose.connection.close();
}

importCourses();