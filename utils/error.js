export class RequestError extends Error {
    statusCode;
  
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }