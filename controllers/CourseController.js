const { Course } = require("../models/Course");
const { User } = require("../models/User");
const { Organization } = require("../models/Organization");
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

        const userId = req.user._id;

        const course = new Course({
            courseName,
            thumbnail,
            description,
            amount,
            author: userId
        });

        let saved = await course.save();
        let courseId = saved._id;

        let own = await User.findOneAndUpdate({ "_id": userId }, { $push: { "ownCourses": courseId } });
        own.courseCount += 1;
        own.save();

        // creating module
        let mobj = { lecName, path }
        let module = await new Module({
            moduleName
        });
        module.files.push(mobj);
        let mod = await module.save();
        let Mid = mod._id;

        let CouPush = await Course.findOneAndUpdate({ "_id": courseId }, { $push: { "modules": Mid } })
        let courPush = await CouPush.save();

        if (!saved && !own && !mod && !courPush) {
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

// const addAdminCourse = async (req, res) => {
//     try {
//         const {
//             courseName,
//             thumbnail,
//             description,
//             moduleName,
//             lecName,
//             path
//         } = req.body;

//         const userId = req.user._id;

//         // creating new course
//         const course = new Course({
//             courseName,
//             thumbnail,
//             description,
//             author: userId,
//             org: true
//         });
//         let saved = await course.save();
//         let courseId = saved._id;

//         // saving course in organization
//         let own = await Organization.findOneAndUpdate({ admin: userId }, { $push: { courses: courseId } });
//         own.courseCount += 1;
//         let ownSaved = await own.save();


//         // creating module
//         let mobj = { lecName, path }
//         let module = await new Module({
//             moduleName
//         });
//         module.files.push(mobj);
//         let mod = await module.save();
//         let Mid = mod._id;

//         let CouPush = await Course.findOneAndUpdate({ "_id": courseId }, { $push: { "modules": Mid } })
//         let courPush = await CouPush.save();

//         if (!saved && !ownSaved && !mod && !courPush) {
//             res.json({ message: "Not able to save Course!" });
//         } else {
//             res.json({
//                 status: true,
//                 message: "Course saved successfully!"
//             });
//         }

//     } catch (error) {
//         res.status(400).json({ status: false, message: "Something went wrong", "Error": error.message });
//     }
// }

const subscribeCourse = async (req, res) => {

    try {

        let { courseId } = req.body;
        let user = req.user;
        let exist = false;

        Course.find({ "subscribers": { $in: [user._id] } }, (err, data) => {
            if (err) {
                console.log("err", err)
            } else {
                data.map((item, index) => {
                    if (item._id == courseId) {
                        return exist = true;
                    }
                })
                if (!exist) {
                    allow();
                } else {
                    res.json({ "msg": "You have already subscribed this course!" })
                }
            }
        });

        async function allow() {
            let sub = await Course.findOneAndUpdate({ "_id": courseId }, { $push: { "subscribers": user._id } })
            sub.totalSubscribers += 1;
            let saved = await sub.save();

            let upUser = await User.findOneAndUpdate({ "_id": user._id }, { $push: { "subscriptions": courseId } });
            upUser.save();

            res.json({
                status: true,
                message: "Subscribed successfully"
            });

        }

    } catch (error) {
        res.status(400).json({ status: false, message: "Fail to subscribe! try again", "Error": error.message });
    }
}

const unsubscribeCourse = async (req, res) => {
    try {
        let { courseId } = req.body;
        let user = req.user;
        // let user = {"_id": kjbcuwebciubeciwbc}

        // Course.find({ subscribers: { $in: [user._id] } }, (err, data) => {
        //     if (err) {
        //         console.log("err", err)
        //     } else {
        //         console.log("data", data);
        //     }
        // });

        let upDoc = await Course.findOneAndUpdate({ "_id": courseId }, { $pull: { "subscribers": user._id } }, { new: true })
        let upUser = await User.findOneAndUpdate({ "_id": user._id }, { $pull: { "subscriptions": courseId } }, { new: true })
        if (!upDoc && !upUser) {
            res.json({ message: "fail to Unsubscribe! Try again" })
        } else {
            res.json({
                status: true,
                message: "Unsubscribed successfully"
            });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: "Fail to unsubscribe! try again", "Error": error.message });
    }
}

const feed = async (req, res) => {
    const exclude = req.user._id;
    try {
        let getFeed = await Course.find({ author: { $ne: exclude } });
        if (getFeed) {
            res.json(getFeed);
        } else {
            res.json({ status: false, message: "No data" });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: "Feed failure", "Error": error.message });
    }
}

const getCourse = async (req, res) => {

    try {

        let courseId = req.body.courseId;
        let Data;
        let course = await Course.findById(courseId)
            .populate('modules')
            .then(p => {
                Data = p;
            })
            .catch(error => Data = error);

        res.json({
            status: true,
            data: Data
        });
    } catch (error) {
        res.status(400).json({ status: false, message: "fail to get course", "Error": error.message });
    }

}



module.exports = { addUserCourse, subscribeCourse, unsubscribeCourse, feed, getCourse };
