export class ApiError extends Error {
  readonly code: number;
  readonly message: string;
  readonly details: string[];

  //   eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(code: number, message: string, details: string[] = [], ...args: any[]) {
    super(message, ...args);
    this.code = code;
    this.message = message;
    this.details = details;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, details: string[] = []) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, details: string[] = []) {
    super(401, message, details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, details: string[] = []) {
    super(403, message, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details: string[] = []) {
    super(404, message, details);
  }
}

export class InternalError extends ApiError {
  constructor(details: string[] = []) {
    super(500, "somthing went wrong please try again later", details);
  }
}

export class jwtExpiredErr extends ApiError {
  constructor(details: string[] = []) {
    super(403, "token has been expired!", details);
  }
}
