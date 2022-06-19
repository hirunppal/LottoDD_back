const createerror = require("../utils/createError");
const cloudinary = require("../services/clound");
const path = require("path");
const { Seller, Product, Order, OrderDetail, sequelize } = require("../models");
const { Qrfunc } = require("../services/qrGem");
const e = require("express");

exports.getAllproduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { registerStat: "APPROVED" },
      include: [{ model: Seller, attributes: ["firstName", "id"] }],
    });
    if (!products) {
      createerror("Products is not found", 400);
    }

    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};
exports.getProdictbyId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { registerStat: "APPROVED", id },
      include: [{ model: Seller, attributes: ["firstName", "id"] }],
    });
    if (!product) {
      createerror("Products is not found", 400);
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.createOrdetbyCarts = async (req, res, next) => {
  try {
    // const t = await sequelize.transaction();

    const { cartItems } = req.body;
    const { user } = req;
    const productCartsids = await cartItems.map((el) => el.id);

    const productsToOrder = await Product.findAll({
      where: { id: productCartsids },
      include: [{ model: Seller, attributes: ["firstName", "id"] }],
    });
    if (!productsToOrder) {
      createerror("Products is not found", 400);
    }
    if (productsToOrder.length < cartItems.length) {
      createerror("Product .... Get ordered", 402);
    }
    productsToOrder.map((el) => {
      if (el.registerStat === "PENDING") {
        createerror("Product .... Get ordered", 402);
      }
    });
    if (productsToOrder.length < cartItems.length) {
      createerror("Product .... Get ordered", 402);
    }

    const result = await sequelize.transaction(async (t) => {
      await Product.update(
        { registerStat: "PENDING" },
        { where: { id: productCartsids } },
        { transaction: t }
      );

      const order = await Order.create(
        {
          status: "PENDING",
          customerId: user.id,
        },
        { transaction: t }
      );

      // CREATE OD DT
      productsToOrder.map((el) => {
        const obj = {
          price: el.basePrice,
          orderId: order.id,
          productId: el.id,
          sellerId: el.sellerId,
        };
        const OD = async (object) => {
          const detailadd = await OrderDetail.create(object);
          console.log("IIIIDDDDDoooo");
          console.log(detailadd.orderId);
        };
        return OD(obj);
      });
      // CREATE OD Details

      return order;
    });

    const response = async ({ id }) => {
      // const id = await Order

      const orderdetail = await OrderDetail.findAll({
        where: { orderId: id },
      });
      return orderdetail;
    };
    const odt = await response(result);

    res.status(200).json(result);
  } catch (err) {
    // const tb = async () => {
    //   await t.rollback();
    // };
    // tb();
    next(err);
  }
};

exports.PayorderbyId = async (req, res, next) => {
  try {
    const { OrderId } = req.params;
    const { file } = req;
    const { user } = req;

    console.log(OrderId);
    if (!file || !OrderId) {
      createerror("Payment Infrom not found", 404);
    }
    const Ordertopay = await Order.findOne({
      where: { id: OrderId },
    });
    if (!Ordertopay) {
      createerror("Ordertopay to pay is not found", 404);
    }
    const OrderDetailToPay = await OrderDetail.findAll({
      where: { orderId: OrderId },
    });
    if (!OrderDetailToPay) {
      createerror("OrderDetailtopay is not found", 404);
    }
    console.log("HEre");
    if (file) {
      if (Ordertopay.paymentSlip) {
        const split = Ordertopay.paymentSlip.split("/");
        const publicId = split[split.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      const result = await cloudinary.upload(req.file.path);
      Ordertopay.paymentSlip = result.secure_url;
    }
    Ordertopay.status = "PAYMENTREQ";
    await Ordertopay.save();

    // const OrderPaymentRequest = await Order.update(
    //   { paymentSlip: file, status: "PAYMENTREQ" },
    //   { where: { id: OrderId } }
    // );
    // console.log(OrderPaymentRequest);
    res.status(200).json({ Ordertopay });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.GetQr = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const Ordertopay = await OrderDetail.findAll({
      where: { orderId: orderId },
      include: [Product],
    });
    if (!Ordertopay) {
      createerror("Ordertopay to pay is not found", 404);
    }

    const amount = Ordertopay.map((el) => el.Price).reduce(
      (a, b) => +a + +b,
      0
    );
    const Qrsvg = await Qrfunc(amount, orderId);
    // Prints: /Users/mjr
    console.log(path.dirname(__filename));
    // Prints: /Users/mjr
    res.status(200).json({ Qrsvg, Ordertopay });
  } catch (err) {
    next(err);
  }
};

// exports.updateProfile = async (req, res, next) => {
//   try {
//     if (req.file) {
//       const result = await cloudinary.upload(req.file.path);
//       await Order.update(
//         { profilePic: result.secure_url },
//         { where: { id: req.user.id } }
//       );
//       fs.unlinkSync(req.file.path);
//       res.json({ profilePic: result.secure_url });
//     } else {
//       createError("file not found", 400);
//     }
//   } catch (err) {
//     next(err);
//   }
// };
// Version singile file
// if (req.file) {
//   const result = await cloudinary.upload(req.file.path);
//   await Users.update(
//     { profilePic: result.secure_url },
//     { where: { id: req.user.id } }
//   );
//   fs.unlinkSync(req.file.path);
//   res.json({ profilePic: result.secure_url });
// } else {
//   createError("file not found", 400);
// }
