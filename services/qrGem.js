const generatePayload = require("promptpay-qr");
const qrcode = require("qrcode");
const path = require("path");

const fs = require("fs");

const mobileNumber = "061-398-7015";
// const IDCardNumber = "0-0000-00000-00-0";
// const amount = 0;
// console.log(payload);

// Convert to SVG QR Code
const options = { type: "svg", color: { dark: "#000", light: "#fff" } };
exports.Qrfunc = async (amount, id) => {
  const payload = await generatePayload(mobileNumber, { amount }); //First parameter : mobileNumber || IDCardNumber
  const res = qrcode.toString(payload, options, (err, svg) => {
    if (err) return console.log(err);
    // console.log();

    fs.writeFileSync(`${__dirname}/OTQR/./qr${id}.svg`, svg);
    // return svg;
  });
  return res;
};
// Qrfunc(80);
