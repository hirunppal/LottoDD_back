const express = require("express");

const adminontroller = require("../controller/adminContoller");
const auth = require("../middleweres/authadmin");

const router = express.Router();

router.get("/authentication", auth, adminontroller.getMod);
router.post("/authentication/signin", adminontroller.signin);
router.post("/authentication/create", adminontroller.createAdmin);
router.get("/getorders", auth, adminontroller.getAllOrders);
router.patch("/patchorders", auth, adminontroller.EditOrders);
router.delete(
  "/deleteorders/:id",
  auth,
  adminontroller.ApprovePdbyOrder,
  adminontroller.DeleteOrders
);

router.get("/allseller", auth, adminontroller.getAllseller);
router.get("/seller/:id", auth, adminontroller.getproductbysellerId);
// router.get("/seller/:id", auth, adminontroller.getproductbysellerId);

router.post("/seller/:id/", auth, adminontroller.Postproduct);
router.patch("/seller/:id/", auth, adminontroller.Editproduct);
router.delete("/seller/", auth, adminontroller.Editproduct);
// router.post("/seller/:id/", auth, adminontroller.Postproduct);
// router.patch("/seller/:id/", auth, adminontroller.Editproduct);

module.exports = router;
