const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ValidateEmail } = require("../utils/Validators");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 20 },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: [ValidateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png" },
    courseCount: { type: Number, default: 00 },
    ownCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    memberships: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
    isAdmin: { type: Boolean, default: false },
    org: { type: Schema.Types.ObjectId, ref: 'Organization' }
},
{ timestamps: true }
);


const User = new mongoose.model("User", UserSchema);

module.exports = { User };