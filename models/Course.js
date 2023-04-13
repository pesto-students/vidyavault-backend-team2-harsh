const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new mongoose.Schema({
    courseName: { type: String, required: true, minlength: 1, maxlength: 20 },
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    thumbnail: { type: String, default: 'https://media.istockphoto.com/id/1147544809/vector/no-thumbnail-image-vector-graphic.jpg?s=170667a&w=0&k=20&c=v9QBkaN6fXxy1b-wsTQ6QhHUVGLo8JMMxhUBcWzOH0A=' },
    description: { type: String, minlength: 0, maxlength: 30 },
    amount: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalSubscribers: { type: Number, default: 0 },
    subscribers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    org: { type: Boolean, default: false }
},
{ timestamps: true }
);


const Course = new mongoose.model("Course", CourseSchema);

module.exports = { Course };
