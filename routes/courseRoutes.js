const express = require("express");
const {
    addUserCourse,
    addAdminCourse,
    subscribeCourse,
    feed, 
    unsubscribeCourse,
    removeMembership} = require('../controllers/CourseController');
const { auth } = require("../authorization/auth");

const router = express.Router();

// course routes
router.route("/user/feed").get(auth, feed);
router.route("/user/subscribe").post(auth, subscribeCourse);
router.route("/user/unsubscribe").post(auth, unsubscribeCourse);
router.route("/user/removemembership").post(auth, removeMembership);
router.route("/user/cc").post(auth, addUserCourse);
router.route("/admin/cc").post(auth, addAdminCourse);


module.exports = router;