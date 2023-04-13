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
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }
}

const addModule = async (req, res) => {

    try {
        const {
            courseId,
            moduleName,
            lecName,
            path } = req.body;

        let mobj = { lecName, path }
        let module = await new Module({
            moduleName
        });
        module.files.push(mobj);
        let saved = await module.save();
        let Mid = saved._id;

        let CouPush = await Course.findOneAndUpdate({ "_id": courseId }, { $push: { "modules": Mid } })
        let courPush = await CouPush.save();

        if (!saved && !courPush) {
            res.status(400).json({ status: false, message: "unable to create new module" });
        } else {
            res.status(200).json({ status: true, message: "module created successfuly" });
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }

}

const updateModuleName = async (req, res) => {

    try {

        const { moduleId, moduleName } = req.body;

        if (moduleId == "" && moduleName == "") {
            return res.status(422).json({ status: false, message: "missing id or name" });
        }

        let mod = await Module.findOneAndUpdate({ "_id": moduleId }, { moduleName: moduleName });
        let saved = await mod.save();

        if (!saved) {
            res.status(400).json({ status: false, message: "unable to save moduleName changes" });
        } else {
            res.status(200).json({ status: true, message: "moduleName changes saved successfuly" });
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }
}

const deleteFile = async (req, res) => {

    try {
        const {
            moduleId,
            fileId
        } = req.body;

        if (!moduleId) {
            return res.status(422).json({ status: false, message: "Missing module id" });
        }
        if (!fileId) {
            return res.status(422).json({ status: false, message: "Missing file id" });
        }

        let own = await Module.findOneAndUpdate({ "_id": moduleId },
            {
                $pull: {
                    files: { "_id": fileId }
                }
            }
        )

        let saved = await own.save();

        if (!saved) {
            res.status(400).json({ status: false, message: "unable to delete lecture" });
        } else {
            res.status(200).json({ status: true, message: "lecture deleted successfuly" });
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }

}

const deleteModule = async (req, res) => {

    try {
        const { moduleId, courseId } = req.body;

        let mod = await Module.findOneAndDelete({ "_id": moduleId });
        let check = await Course.findOneAndUpdate({ "_id": courseId }, { $pull: { "modules": mod._id } });
        let saved = await check.save();

        if (!saved) {
            res.status(200).json({ status: true, message: "unable to delete the module! Try again" });
        } else {
            res.status(200).json({ status: true, message: "module deleted successfuly" });
        }

    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }
}

module.exports = { updateModuleName, addFile, deleteModule, addModule, deleteFile };
