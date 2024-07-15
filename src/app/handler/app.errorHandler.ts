import { Response, Request, NextFunction } from "express";
import { Logger } from "../../logging/logger";
import { ApiError, NotFoundError } from "../../common/types/app.Errors";
import { ResponseFactory } from "../../common/factories/response.factory";

const logger = new Logger();
// eslint-disable-next-line no-unused-vars
function notFoundHandler(_req: Request, _res: Response, _next: NextFunction) {
  throw new NotFoundError("the Url you try to fetch does not exist");
}
// eslint-disable-next-line no-unused-vars
function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(`[${req.ip}] - ${req.method} ${req.path} - ${res.statusCode}`, { ...err, stack: err.stack });

  const message = err instanceof ApiError ? err.message : "somthing went wrong please try again later",
    code = err instanceof ApiError ? err.code : 500,
    details = err instanceof ApiError ? err.details : [],
    errResponse = ResponseFactory.errorResponse(code, message, details);

  res.status(code).json(errResponse);
}

export { notFoundHandler, errorHandler };
