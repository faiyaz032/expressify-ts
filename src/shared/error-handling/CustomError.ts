class CustomError extends Error {
  statusCode: number;
  success: boolean;
  operational: boolean;
  errors: {
    message: string;
    details?: Array<{ field: string; message: string; location: string }>;
  };

  constructor(
    statusCode: number,
    message: string,
    details?: Array<{ field: string; message: string; location: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.operational = true;
    this.errors = { message, details };
    // Capture the stack trace, but do not include the constructor
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export default CustomError;
