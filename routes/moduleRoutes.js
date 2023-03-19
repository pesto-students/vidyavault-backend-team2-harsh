const express = require("express");
const { auth } = require("../authorization/auth");
const {
    updateModule,
    addFile,
    deleteModule } = require("../controllers/ModuleController");

const router = express.Router();

// Module routes
router.route("/module").patch(auth, updateModule);
router.route("/modulefile").post(auth, addFile);
router.route("/module/:id").delete(auth, deleteModule);


module.exports = router;