const express = require("express");

const productsContoller = require("../controller/productsController");
const authuser = require("../middleweres/authuser");
const router = express.Router();

router.get("", productsContoller.getAllproduct);
router.get(
  "/cartfetch/:id",
  authuser.customer,
  productsContoller.getProdictbyId
);
router.post(
  "/createOrder",
  authuser.customer,
  productsContoller.createOrdetbyCarts
);
// router.get(
//   "",
//   authuser.customer,
//   productsContoller.createOrdetbyCarts
// );
// router.get();

module.exports = router;
