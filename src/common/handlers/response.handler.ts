export class ResponseHandler {
  static success<T>(message: string, data?: T) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string) {
    return {
      success: false,
      message,
    };
  }
}
