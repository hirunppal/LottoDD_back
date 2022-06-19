const validator = require("validator");
const createerror = require("./createerror");

exports.ValidINP = (phoneNumoremail, password, confirmpassword) => {
  const isitmoblephoe = validator.isMobilePhone(phoneNumoremail + "");
  const isitEmail = validator.isEmail(phoneNumoremail + "");
  if (!isitmoblephoe && !isitEmail) {
    createerror("Moblephone or Email not valid", 400);
  }
  if (!phoneNumoremail) {
    createerror("Email or phone number is required", 400);
    // If case registor
    if (!password || !confirmpassword) {
      createerror("password is requred");
    }
    if (password.length < 6 || password.length > 25) {
      createerror("Password Not Valid must be 6-25 charector", 400);
    }
    if (password !== confirmpassword) {
      createerror("Password Not Match", 400);
    }
    if (isitmoblephoe) {
      return "PH";
    }
    if (isitEmail) {
      return "EM";
    }
  }
};
