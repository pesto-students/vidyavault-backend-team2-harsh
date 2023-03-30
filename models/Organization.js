const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrganizationSchema = new mongoose.Schema({
    orgName: { type: String, required: true, minlength: 1, maxlength: 20, unique: true },
    description: { type: String, minlength: 0, maxlength: 80 },
    goal: { type: String, minlength: 0, maxlength: 80 },
    slogan: { type: String, minlength: 0, maxlength: 80 },
    banner: { type: String, default: 'https://res.cloudinary.com/dlmfyhkgx/image/upload/v1678770772/orgBanner.png' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    membersCount: { type: Number, default: 00 },
},
    { timestamps: true }
);


const Organization = new mongoose.model("Organization", OrganizationSchema);

module.exports = { Organization };


