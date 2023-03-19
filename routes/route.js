const express = require("express");
const router = express.Router();
const {
    signup,
    signin,
    getUser,
    updateUser,
    userResetPass,
} = require("../controllers/UserController");
const {
    addUserCourse,
    addAdminCourse,
    subscribeCourse,
    feed } = require('../controllers/CourseController');
const { auth } = require("../authorization/auth");
const {
    updateModule,
    addFile,
    deleteModule } = require("../controllers/ModuleController");
const {
    adminSignup,
    adminResetPass } = require("../controllers/AdminController");

    
// user routes
router.route("/user/signup").post(signup);
router.route("/user/signin").post(signin);
router.route("/user/resetpassword").post(userResetPass);
router.route("/user/:id").get(auth, getUser);
router.route("/user/:id").post(auth, updateUser);

// Admin routes
router.route("/admin/signup").post(adminSignup);
router.route("/admin/signin").post(signin);
router.route("/admin/resetpassword").post(adminResetPass);
router.route("/admin/:id").get(auth, getUser);
router.route("/admin/:id").post(auth, updateUser);

// course routes
router.route("/user/feed/:id").get(auth, feed);
router.route("/user/subscribe/:id").post(auth, subscribeCourse);
router.route("/user/cc/:id").post(auth, addUserCourse);
router.route("/admin/cc/:id").post(auth, addAdminCourse);

// Module routes
router.route("/module").patch(auth, updateModule);
router.route("/modulefile").post(auth, addFile);
router.route("/module/:id").delete(auth, deleteModule);

// Organization routes
// router.route("/org/:id").get(auth, getOrg);


