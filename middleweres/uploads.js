const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// config storage can config more ex Name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "public/slips");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});
// config destination
module.exports = multer({ storage });
