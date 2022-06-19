const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const createerror = require("../utils/createError");
const { Customer } = require("../models");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signin = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;
    console.log(req.body);
    const user = await Customer.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNum: emailOrPhone }],
      },
    });
    console.log(user);

    if (!user) {
      createerror("invalid credential", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      createerror("invalid credential", 400);
    }
    const token = genToken({ id: user.id });
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    console.log(req.body);
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

    const user = await Customer.create({
      firstName,
      lastName,
      email: isEmail ? emailOrPhone : null,
      phoneNum: isMobilePhone ? emailOrPhone : null,
      password: hashedPassword,
    });

    const token = genToken({ id: user.id });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};
// exports.getME = async (req, res, next) => {
//   try {
//     const user = JSON.parse(JSON.stringify(req.user));
//     const ff = await firendSer.getAcceptedFriends(req.user.id);
//     // console.log(fiends);
//     user.friends = ff;
//     res.status(200).json({ user });
//   } catch (err) {
//     next(err);
//   }
// };
exports.getuser = async (req, res, next) => {
  try {
    // console.log("Hi");
    const user = JSON.parse(JSON.stringify(req.user));
    console.log(user);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};
