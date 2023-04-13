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
    memberSignup, 
    removeMembership } = require("../controllers/AdminController");
const { updateOrg, getOrg } = require("../controllers/OrgController");

const router = express.Router();



// user routes
router.route("/user/signup").post(signup);//
router.route("/user/signin").post(signin);//
router.route("/user").get(auth, getUser);//
router.route("/user").patch(auth, updateUser);//


router.route("/resetpasswordemail").post(resetPassEmail);//
router.route("/resetpassword").post(auth, resetPass);//



// Admin routes
router.route("/admin/signup").post(adminSignup);



router.route("/admin/memberinviteemail").post(auth, memberInviteEmail);
router.route("/admin/membersignup").post(auth, memberSignup);
router.route("/admin/removemember").post(auth, removeMembership);
router.route("/admin/org").patch(auth, updateOrg);
router.route("/admin/org").post(auth, getOrg);


module.exports = router;
