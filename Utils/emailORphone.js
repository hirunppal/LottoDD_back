module.exports = (phoneNumoremail) => {
  const isitmoblephoe = validator.isMobilePhone(phoneNumoremail + "");
  const isitEmail = validator.isEmail(phoneNumoremail + "");

  if (isitmoblephoe) {
    return "PH";
  }
  if (isitEmail) {
    return "EM";
  } else return createerror("Email or PhoneNumber is not Validate", 400);
};
