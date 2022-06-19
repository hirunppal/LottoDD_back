module.exports = (message, statcode) => {
  const error = new Error(message);
  error.statuscode = statcode;
  throw error;
};
