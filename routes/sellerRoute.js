const express = require("express");

const sellerController = require("../controller/sellerController");
const authuser = require("../middleweres/authuser");
const router = express.Router();

router.post("/signup", sellerController.signup);
router.post("/signin", sellerController.signin);
router.get("/", authuser.seller, sellerController.fetchmystore);

module.exports = router;
