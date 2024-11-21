class appError extends Error {
  constructor(message, statusError, statusCode) {
    super(message);
    this.message = message;
    this.statusError = statusError;
    this.statusCode = statusCode;
  }
}

export default appError;
