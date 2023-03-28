const { Module } = require("../models/Module");
const { Course } = require("../models/Course");

const addFile = async (req, res) => {

    try {
        const {
            moduleId,
            lecName,
            path
        } = req.body;

        if (!lecName) {
            return res.status(422).json({ status: false, message: "Missing lecture name" });
        }
        if (!path) {
            return res.status(422).json({ status: false, message: "Missing lecture path" });
        }

        let own = await Module.findOneAndUpdate({ "_id": moduleId },
            {
                $push: {
                    files: { lecName: lecName, path: path }
                }
            }
        )

        let saved = await own.save();

        if (!saved) {
            res.status(400).json({ status: false, message: "unable to save new file" });
        } else {
            res.status(200).json({ status: true, message: "file saved successfuly" });
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong" });
    }
}

const updateModule = async (req, res) => {

    try {

        const {
            moduleId,
            fileId,
            moduleName,
            lecName,
            path
        } = req.body;

        if (moduleId == "" && fileId == "") {
            return res.status(422).json({ status: false, message: "Id is missing" });
        }

        if (lecName == "") {
            let mod = await Module.findOneAndUpdate({ "_id": moduleId }, { moduleName: moduleName });
            let saved = await mod.save();
            let own = await Module.updateOne({ files: { $elemMatch: { "_id": fileId } } },
                { $set: { "files.$.path": path } }
            )
            if (!saved && own.modifiedCount == 0 && own.acknowledged == false) {
                res.status(400).json({ status: false, message: "unable to save module changes" });
            } else {
                res.status(200).json({ status: true, message: "module changes saved successfuly" });
            }
        } else if (path == "") {
            let mod = await Module.findOneAndUpdate({ "_id": moduleId }, { moduleName: moduleName });
            let saved = await mod.save();
            let own = await Module.updateOne({ files: { $elemMatch: { "_id": fileId } } },
                { $set: { "files.$.lecName": lecName } }
            )
            if (!saved && own.modifiedCount == 0 && own.acknowledged == false) {
                res.status(400).json({ status: false, message: "unable to save module changes" });
            } else {
                res.status(200).json({ status: true, message: "module changes saved successfuly" });
            }
        } else {
            let mod = await Module.findOneAndUpdate({ "_id": moduleId }, { moduleName: moduleName });
            let saved = await mod.save();
            let own = await Module.updateOne({ files: { $elemMatch: { "_id": fileId } } },
                { $set: { "files.$.lecName": lecName, "files.$.path": path } }
            )
            if (!saved && own.modifiedCount == 0 && own.acknowledged == false) {
                res.status(400).json({ status: false, message: "unable to save module changes" });
            } else {
                res.status(200).json({ status: true, message: "module changes saved successfuly" });
            }
        }



    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong" });
    }
}

const deleteModule = async (req, res) => {

    try {
        const { moduleId, fileId, courseId } = req.body;

        if (moduleId) {
            Module.findOneAndDelete({ _id: moduleId }, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    Course.updateOne({ "_id": courseId }, { $pull: { "modules": docs._id } });
                    res.status(200).json({ status: true, message: "module deleted successfuly" });
                }
            });
        }
        if (fileId) {
            let own = await Module.updateOne({ files: { $elemMatch: { _id: fileId } } },
                { $pull: { files: { _id: fileId } } });
            if (own && own.modifiedCount) {
                res.status(200).json({ status: true, message: "module deleted successfuly" });
            }
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong" });
    }
}

module.exports = { updateModule, addFile, deleteModule };
