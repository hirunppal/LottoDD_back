require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { sequelize, Order, Product, OrderDetail } = require("./models");
const authRouter = require("./routes/authRouter");
const modsRouter = require("./routes/adminRoute");
const productsRouter = require("./routes/productsRoute");
const OrderRoute = require("./routes/OrderRoute");
const sellerRouter = require("./routes/sellerRoute");
const errormiddleware = require("./middleweres/error");
const notfoundmiddleware = require("./middleweres/notfound");
const authuser = require("./middleweres/authuser");

const app = express();
const PORT = process.env.PORT;

try {
  // sequelize.sync({ alter: true });
} catch (e) {
  console.log(e);
}

app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
// app.use("/index", authuser.customer, notfoundmiddleware);
app.use("/auth", authRouter); // test auth

app.use("/search", productsRouter);
app.use("/od", authuser.customer, OrderRoute);
app.use("/user", authuser.customer, authRouter);

app.use("/sellercenter", sellerRouter);
app.use("/admin", modsRouter);

// HANDDLER middlewares
app.use(notfoundmiddleware);
app.use(errormiddleware);
//
app.listen(PORT, () => {
  console.log("server running on port" + PORT);
});
