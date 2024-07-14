import { Response, Request, NextFunction } from "express";
import { NotFoundError } from "./app.errors";
// eslint-disable-next-line no-unused-vars
function notFoundHandler(_req: Request, _res: Response, _next: NextFunction) {
  throw new NotFoundError("the Url you try to fetch does not exist");
}
// eslint-disable-next-line no-unused-vars
function errorHandler(_err: Error, _req: Request, _res: Response, _next: NextFunction) {}

export { notFoundHandler, errorHandler };
