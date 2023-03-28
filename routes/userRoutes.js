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
router.route("/user").get(auth, getUser);
router.route("/user").patch(auth, updateUser);
router.route("/user/resetpassword").post(auth, resetPass);


// Admin routes
router.route("/admin/signup").post(adminSignup);



router.route("/admin/memberinviteemail").post( memberInviteEmail);
router.route("/admin/membersignup").post(auth, memberSignup);


module.exports = router;