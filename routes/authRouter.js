const express = require("express");

const authController = require("../controller/authController");
const authuuser = require("../middleweres/authuser");
const router = express.Router();

router.get("", authuuser.customer, authController.getuser);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
// router.post();
// router.get();

module.exports = router;
