module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  // because errors come from mongoose, so there is no statusCode
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
