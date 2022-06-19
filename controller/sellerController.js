const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const createerror = require("../utils/createError");
const { Seller } = require("../models");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.fetchmystore = async (req, res, next) => {
  try {
    const id = req.user;
    if (!id) {
      createerror("invalid credential", 400);
    }

    const seller = await Seller.findAll({
      where: { id },
      include: [{ model: Product }],
    });
    if (!seller) {
      createerror("seller is not found", 400);
    }
    // console.log(seller);

    res.json({ seller });
  } catch (err) {
    next(err);
  }
};
exports.signin = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;
    const seller = await Seller.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNum: emailOrPhone }],
      },
    });
    // console.log(seller);

    if (!seller) {
      createerror("invalid credential", 400);
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      createerror("invalid credential", 400);
    }
    const token = genToken({ id: seller.id });
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, emailOrPhone, password, confirmPassword } =
      req.body;

    if (!emailOrPhone) {
      createerror("email or phone number is required", 400);
    }
    if (!password) {
      createerror("password is required", 400);
    }
    if (password !== confirmPassword) {
      createerror("password and confirm password did not match", 400);
    }

    const isMobilePhone = validator.isMobilePhone(emailOrPhone + "");
    const isEmail = validator.isEmail(emailOrPhone + "");
    if (!isMobilePhone && !isEmail) {
      createerror("email or phone number is invalid format", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      firstName,
      lastName,
      email: isEmail ? emailOrPhone : null,
      phoneNum: isMobilePhone ? emailOrPhone : null,
      password: hashedPassword,
    });

    const token = genToken({ id: seller.id });
    res.status(201).json({ seller, token });
  } catch (err) {
    next(err);
  }
};
