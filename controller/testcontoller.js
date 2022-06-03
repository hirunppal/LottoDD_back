const { Customer } = require("../models");
exports.testaddd = async (req, res, next) => {
  const cus = await Customer.create({
    firstName: "Hirun",
    lastName: "Jaingam",
    email: "manitja@gmail.com",
    phoneNum: "0963561256",
    password: "123456",
    address: "123456",
  });
  console.log(cus);
};
