const express = require("express");
const { auth } = require("../authorization/auth");
const {
    updateModuleName,
    addFile,
    addModule,
    deleteModule, 
    deleteFile} = require("../controllers/ModuleController");

const router = express.Router();

// Module routes
router.route("/module").post(auth, addModule);//
router.route("/module").patch(auth, updateModuleName);//
router.route("/module").post(auth, deleteModule);// 


router.route("/file").post(auth, addFile);//
router.route("/file").post(auth, deleteFile);//


module.exports = router;