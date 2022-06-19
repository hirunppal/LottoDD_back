module.exports = (err, req, res, next) => {
  if (
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === "SequelizeValidationError"
  ) {
    err.statuscode = 400;
    err.message = err.errors[0].message;
  }
  if (err.name === "TokenExpireError") {
    err.statuscode = 401;
  }
  if (err.name === "JSONWebTokenError") {
    err.statuscode = 401;
  }
  res.status(err.statuscode || 500).json(err.message);
};
