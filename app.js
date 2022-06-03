require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const morgan = require("morgan");
const { sequelize } = require("./models");
const Testcontoller = require("./controller/testcontoller");
// const { Route } = require("express");
try {
  sequelize.sync({ force: true });
} catch (e) {
  console.log(e);
}
app.use("/test", Testcontoller.testaddd);

app.use(cors());
if (process.env.NODE_ENV === "development") {
}
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/user", userRouter);
// app.use("/friends", auth, friendRouter);
// app.use("/me", auth, userProfileRouter);
// app.use("/post", auth, postRouter);

//

// middlewares
// app.use(notfoundmiddleware);
// app.use(errormiddleware);
//
app.listen(PORT, () => {
  console.log("server running on port" + PORT);
});
