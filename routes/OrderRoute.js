const express = require("express");

const productsContoller = require("../controller/productsController");
// const authuser = require("../middleweres/authuser");
const uploads = require("../middleweres/uploads");
const router = express.Router();

router.post("/createOrder", productsContoller.createOrdetbyCarts);
router.post(
  "/payOrder/:OrderId",
  uploads.single("paymentSlip"),
  productsContoller.PayorderbyId
);
router.get("/Qr/:orderId", productsContoller.GetQr);

module.exports = router;
