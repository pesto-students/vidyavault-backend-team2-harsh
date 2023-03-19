const { Course } = require("../models/Course");
const { User } = require("../models/User");
const { Organization } = require("../models/Organization");
const { CourseFile } = require("../models/CourseFile");
const { Module } = require("../models/Module");

const addUserCourse = async (req, res) => {

    
    try {
        const {
            courseName,
            thumbnail,
            description,
            amount,
            moduleName,
            lecName,
            path
        } = req.body;

        const course = new Course({
            courseName,
            thumbnail,
            description,
            amount,
            author: req.params.id
        });

        let saved = await course.save();

        let courseId = saved._id;

        let own = await User.findOneAndUpdate({ _id: req.params.id }, { $push: { ownCourses: courseId } });
        own.courseCount += 1;
        own.save();

        // creating module
        let mobj = { lecName, path }
        let module = await new Module({
            moduleName
        });
        module.files.push(mobj);
        let mod = await module.save();
        let CId = mod._id;


        // Binding everithing in here
        let file = await new CourseFile({
            courseId: courseId
        });
        file.courseData.push(CId)
        let fileSaved = await file.save();


        if (!saved && !own && !mod && !fileSaved) {
            res.json({ message: "Not able to save Course!" });
        } else {
            res.json({
                status: true,
                message: "Course saved successfully!"
            });
        }

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
    }
}

const addAdminCourse = async (req, res) => {
    try {
        const {
            courseName,
            thumbnail,
            description,
            moduleName,
            lecName,
            path
        } = req.body;

        // creating new course
        const course = new Course({
            courseName,
            thumbnail,
            description,
            author: req.params.id,
            org: true
        });
        let saved = await course.save();
        let courseId = saved._id;

        // saving course in organization
        let own = await Organization.findOneAndUpdate({ admin: req.params.id }, { $push: { courses: courseId } });
        own.courseCount += 1;
        let ownSaved = await own.save();


        // creating module
        let mobj = { lecName, path }
        let module = await new Module({
            moduleName
        });
        module.files.push(mobj);
        let mod = await module.save();
        let CId = mod._id;


        // Binding everithing in here
        let file = await new CourseFile({
            belongsTO: req.params.id,
            courseId
        });
        file.courseData.push(CId)
        let fileSaved = await file.save();


        if (!saved && !ownSaved && !fileSaved) {
            res.json({ message: "Not able to save Course!" });
        } else {
            res.json({
                status: true,
                message: "Course saved successfully!"
            });
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong" });
    }
}

const subscribeCourse = async (req, res) => {

    try {

        let { courseId } = req.body;
        let sub = await Course.findOneAndUpdate({ _id: courseId }, { $push: { subscribers: req.params.id } })
        console.log("Before", sub);
        sub.totalSubscribers += 1;
        console.log("After", sub);
        let saved = await sub.save();

        let CId1 = saved._id;

        let subscribedCourse = await User.findOneAndUpdate({ _id: req.params.id }, { $push: { subscriptions: CId1 } });

        if (!saved) {
            res.json({ message: "subscription fail!" });
        } else {
            res.json({
                status: true,
                message: "Subscribed successfully"
            });
        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Fail to subscribe! try again" });
    }
}

const feed = async (req, res) => {
    const exclude = req.params.id;
    try {
        let getFeed = await Course.find({ author: { $ne: exclude } });
        if (getFeed) {
            res.json(getFeed);
        } else {
            res.json({ status: false, message: "No data" });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: "Feed failure" });
    }
}

module.exports = { addUserCourse, addAdminCourse, subscribeCourse, feed };
