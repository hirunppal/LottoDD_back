const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op, Model, where } = require("sequelize");
const createerror = require("../utils/createError");
const {
  Admin,
  Seller,
  Product,
  Order,
  OrderDetail,
  sequelize,
} = require("../models");
const e = require("express");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signin = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;
    const admin = await Admin.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNum: emailOrPhone }],
      },
    });
    console.log(admin);

    if (!admin) {
      createerror("invalid credential", 400);
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      createerror("invalid credential", 400);
    }
    const token = genToken({ id: admin.id });
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};
exports.getMod = async (req, res, next) => {
  try {
    const mod = JSON.parse(JSON.stringify(req.mod));
    console.log(mod);
    res.status(201).json({ mod });
  } catch (err) {
    next(err);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const { email, phoneNum, password, confirmPassword } = req.body;

    if (!password) {
      createerror("password is required", 400);
    }
    if (password !== confirmPassword) {
      createerror("password and confirm password did not match", 400);
    }
    console.log(req.body);
    const isMobilePhone = validator.isMobilePhone(phoneNum + "");
    const isEmail = validator.isEmail(email + "");
    if (!isMobilePhone || !isEmail) {
      createerror("email or phone number is invalid format", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      phoneNum,
      password: hashedPassword,
    });

    const token = genToken({ id: admin.id });
    res.status(201).json({ admin, token });
  } catch (err) {
    next(err);
  }
};

exports.getAllseller = async (req, res, next) => {
  try {
    const seller = await Seller.findAll({ include: [{ model: Product }] });
    if (!seller) {
      createerror("seller is not found", 400);
    }
    // console.log(seller);
    res.status(200).json(seller);
  } catch (err) {
    next(err);
  }
};
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ include: [{ model: OrderDetail }] });
    if (!orders) {
      createerror("orders is not found", 404);
    }
    // console.log(seller);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
exports.EditOrders = async (req, res, next) => {
  try {
    // const { id } = req.params;
    const { ordersarr } = req.body;
    // console.log(ordersarr);
    const ordersIds = await ordersarr.map((el) => el.id);
    const orders = await Order.findAll({
      where: { id: ordersIds },
      include: [{ model: OrderDetail }],
    });
    if (!orders) {
      createerror("orders are not found", 404);
    }
    if (orders?.length < ordersarr?.length) {
      createerror(
        `There's ${orders?.length - ordersarr?.length} order not found`,
        404
      );
    }
    for (let k of ordersarr) {
      const obj = { ...k };
      delete obj.id;
      if (k.id) {
        const fUpdateOrder = async (id, obj) => {
          const ordersupdated = await Order.update(obj, {
            where: { id: id },
          });
          return ordersupdated;
        };
        const resx = await fUpdateOrder(k.id, obj);
        console.log(resx);
      }
    }
    // const x = await orders.map((el) => {
    //   const resOrders = ordersarr.map((nel) => {
    //     if (el.id === nel.id) {
    //       const fUpdateOrder = async () => {
    //         const ordersupdated = await Order.update(nel, {
    //           where: { id: nel.id },
    //         });
    //       };
    //       const resorder = fUpdateOrder();
    //       // return resorder;
    //     }
    //   });
    //   // return resOrders;
    // });

    const responseallupdated = await Order.findAll({
      where: { id: ordersIds },
    });
    // console.log(ordersupdated);
    res.status(200).json(responseallupdated);
  } catch (err) {
    next(err);
  }
};
exports.DeleteOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await Order.findOne({ where: { id } });
    if (!orders) {
      createerror("orders are not found", 404);
    }
    const ordersdt = await OrderDetail.findAll({
      where: { orderId: id },
      include: [Product],
    });
    if (!ordersdt) {
      createerror("orders are not found", 404);
    }

    // const result = await sequelize.transaction(async (t) => {
    console.log("2");

    const orderdetail = await OrderDetail.destroy(
      {
        where: { orderId: id },
      }
      // { transaction: t }
    );
    console.log("3");
    console.log(orderdetail);
    console.log("orderdetail");
    const ordersdeleted = await Order.destroy(
      {
        where: { id: id },
      }
      // { transaction: t }
    );
    // });
    console.log(ordersdeleted);
    console.log("ordersdeleted");
    res.status(200).json({ message: "Orders has been deleted" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.ApprovePdbyOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await Order.findOne({ where: { id } });
    if (!orders) {
      createerror("orders are not found", 404);
    }
    const ordersdt = await OrderDetail.findAll({
      where: { orderId: id },
      include: [Product],
    });
    if (!ordersdt) {
      createerror("orders are not found", 404);
    }
    const pdid = [];
    for (let k of ordersdt) {
      pdid.push(k.Product.id);
    }
    const notremov = [...pdid];
    const pd = await Product.update(
      { registerStat: "APPROVED" },
      { where: notremov }
    );
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getproductbysellerId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findAll({
      where: { id },
      include: [{ model: Product }],
    });
    if (!seller) {
      createerror("seller is not found", 400);
    }
    // console.log(seller);
    res.status(200).json({ seller });
  } catch (err) {
    next(err);
  }
};
exports.Postproduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { products, email } = req.body;
    console.log(req.body);

    const seller = Seller.findOne({ where: { id: id } });
    if (!seller) {
      createerror("seller is not found", 400);
    }
    console.log(products);
    const product = await products.map((el) => {
      const hidFunction = async (el) => {
        const pd = await Product.create({
          lottoNum: el.lottoNum,
          lottoSet: el.lottoSet,
          registerStat: el.registerStat || "REGISTERING",
          prizeDate: el.prizeDate,
          sellerId: id,
        });
        return pd;
      };
      return hidFunction(el);
    });
    console.log(products);
    res.json(products);
  } catch (err) {
    next(err);
  }
};
exports.Editproduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const {
      productId,
      updatevalue: { register_stat, lotto_num, lotto_set },
    } = req.body;
    const seller = Seller.findOne({ where: { id: id } });
    if (!seller) {
      createerror("Seller is not found", 400);
    }
    const product = await Product.findOne({
      where: { id: productId, sellerId: id },
    });

    if (!product) {
      createerror("Product is not match", 400);
    }
    if (lotto_num.length < 6) {
      createerror("Lotto Number Invalid", 400);
    }

    const pd = await Product.update(
      { registerStat: register_stat, lottoNum: lotto_num, lottoSet: lotto_set },
      { where: { id: productId } }
    );
    if (pd) {
      res.status(200).json("Updated");
    }
    if (!pd) {
      res.status(200).json("No value to Update");
    }
  } catch (err) {
    next(err);
  }
};
exports.Deleteproduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const seller = Seller.findOne({ where: { id: id } });
    if (!seller) {
      createerror("Seller is not found", 400);
    }
    const product = await Product.find({
      where: { id: productId, sellerId: id },
    });

    if (!product) {
      createerror("Product is not match", 400);
    }

    const pd = await Product.delete({ where: { id: productId } });
    if (pd) {
      res.status(200).json("Deleted");
    }
    if (!pd) {
      res.status(200).json("No Pd to Update");
    }
  } catch (err) {
    next(err);
  }
};
