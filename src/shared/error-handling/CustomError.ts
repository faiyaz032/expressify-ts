class CustomError extends Error {
  statusCode: number;
  success: boolean;
  operational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.operational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
