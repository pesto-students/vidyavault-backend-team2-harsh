const express = require("express");
const {
    addUserCourse,
    subscribeCourse,
    feed, 
    unsubscribeCourse,
    getCourse } = require('../controllers/CourseController');
const { auth } = require("../authorization/auth");

const router = express.Router();

// course routes
router.route("/user/feed").get(auth, feed);//
router.route("/course").get(auth, getCourse);//

router.route("/cc").post(auth, addUserCourse);//

router.route("/user/subscribe").post(auth, subscribeCourse);
router.route("/user/unsubscribe").post(auth, unsubscribeCourse);


module.exports = router;