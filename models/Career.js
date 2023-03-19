const mongoose = require("mongoose");
const { ValidateEmail } = require("../utils/Validators");

const CareerSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 0, maxlength: 20 },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: [ValidateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    country: { type: String, required: true, minlength: 2, maxlength: 20 },
    skills: { type: String, required: true, minlength: 2, maxlength: 20 },
    expectation: { type: String, required: true, minlength: 2, maxlength: 100 }
},
{ timestamps: true }
);


const Career = new mongoose.model("Career", CareerSchema);

module.exports = { Career };