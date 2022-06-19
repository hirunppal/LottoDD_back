const jwt = require("jsonwebtoken");
const createError = require("../utils/createerror");
const { Customer, Selle, Order, OrderDetail } = require("../models");

exports.customer = async (req, res, next) => {
  try {
    // console.log("Hi");
    const { authorization } = req.headers;
    // console.log(authorization);
    
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("You are unauthorized", 401);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      createError("You are unauthorized", 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await Customer.findOne({
      where: { id: payload.id },
      attributes: { exclude: ["password"] },
      include: [{ model: Order, include: [OrderDetail] }],
      order: [["createdAt", "DESC"]],
    });

    if (!user) {
      createError("You are unauthorized", 401);
    }
    // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
exports.seller = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // console.log(authorization);
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("You are unauthorized", 401);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      createError("You are unauthorized", 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await Seller.findOne({
      where: { id: payload.id },
      attributes: { exclude: ["password"], include: [Order] },
    });
    if (!user) {
      createError("You are unauthorized", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
