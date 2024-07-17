import { RequestHandler } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { BadRequestError } from "../../common/types/app.Errors";

export class ValidationMiddleware {
  static validate(validations: ValidationChain[]): RequestHandler {
    return async (req, _res, next) => {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req).formatWith(({ msg }) => msg);

      if (errors.isEmpty()) return next();

      next(new BadRequestError("invalid fields", [...errors.array().map((err) => (err as string).toString())]));
    };
  }
}
