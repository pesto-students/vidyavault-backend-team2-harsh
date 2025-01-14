const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModuleSchema = new mongoose.Schema({
    moduleName: { type: String, default: "Module" },
    files: [
        {
            lecName: { type: String },
            path: { type: String }
        }
    ]
},
{ timestamps: true }
);


const Module = new mongoose.model("Module", ModuleSchema);

module.exports = { Module };