const express = require("express");
const {
    signup,
    signin,
    getUser,
    updateUser,
    resetPassEmail,
    resetPass
} = require("../controllers/UserController");
const { auth } = require("../authorization/auth");
const {
    adminSignup,
    memberInviteEmail,
    memberSignup } = require("../controllers/AdminController");

const router = express.Router();


// user routes
router.route("/user/signup").post(signup);
router.route("/user/signin").post(signin);
router.route("/user/resetpasswordemail").post(resetPassEmail);
router.route("/user/:id").get(auth, getUser);
router.route("/user/:id").post(auth, updateUser);
router.route("/user/resetpassword/:id").post(auth, resetPass);


// Admin routes
router.route("/admin/signup").post(adminSignup);
router.route("/admin/signin").post(signin);
router.route("/admin/resetpasswordemail").post(resetPassEmail);
router.route("/admin/:id").get(auth, getUser);
router.route("/admin/:id").post(auth, updateUser);
router.route("/admin/resetpassword/:id").post(auth, resetPass);

router.route("/admin/memberinviteemail/:id").post(auth, memberInviteEmail);
router.route("/admin/membersignup").post(auth, memberSignup);


module.exports = router;