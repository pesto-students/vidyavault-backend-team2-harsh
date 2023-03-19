const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseFileSchema = new mongoose.Schema({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseData: [{ type: Schema.Types.ObjectId, ref: 'Module' }]
});

const CourseFile = new mongoose.model("CourseFile", CourseFileSchema);

module.exports = { CourseFile };

