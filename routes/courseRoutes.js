const express = require("express");
const {
    addUserCourse,
    addAdminCourse,
    subscribeCourse,
    feed } = require('../controllers/CourseController');
const { auth } = require("../authorization/auth");

const router = express.Router();

// course routes
router.route("/user/feed/:id").get(auth, feed);
router.route("/user/subscribe/:id").post(auth, subscribeCourse);
router.route("/user/cc/:id").post(auth, addUserCourse);
router.route("/admin/cc/:id").post(auth, addAdminCourse);


module.exports = router;