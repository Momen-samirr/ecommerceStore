const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.statusError = err.statusError || "error";

  res.status(err.statusCode).json({
    status: err.statusError,
    message: err.message,
    codeError: err.statusCode,
    error: err,
    stack: err.stack,
  });
};

export default globalError;
