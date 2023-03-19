const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrganizationSchema = new mongoose.Schema({
    orgName: { type: String, required: true, minlength: 1, maxlength: 20, unique: true },
    description: { type: String, minlength: 0, maxlength: 40 },
    goal: { type: String, minlength: 0, maxlength: 40 },
    slogan: { type: String, minlength: 0, maxlength: 40 },
    banner: { type: String, default: 'https://res.cloudinary.com/dlmfyhkgx/image/upload/v1678770772/orgBanner.png' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    courseCount: { type: Number, default: 00 },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    membersCount: { type: Number, default: 00 },
},
    { timestamps: true }
);


const Organization = new mongoose.model("Organization", OrganizationSchema);

module.exports = { Organization };


