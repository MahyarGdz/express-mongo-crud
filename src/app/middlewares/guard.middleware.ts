import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError, jwtExpiredErr } from "../../common/types/app.Errors";
import { NextFunction, Response, Request } from "express";
import { IAdmin } from "../models/Abstraction/IAdmin";
import passport from "passport";

class Guard {
  private static instance: Guard;
  private constructor() {}

  static get(): Guard {
    if (!this.instance) {
      this.instance = new Guard();
    }
    return this.instance;
  }
  /**
   *  this method is callback of passport authenticate method that add a user to reqeust object.
   *  if user not exist or any error happend the request will fail with corresponding error message
   */
  public handleJwt = (req: Request, _res: Response, next: NextFunction) => {
    return async (err: Error, admin: IAdmin, info: string | object | JsonWebTokenError | TokenExpiredError) => {
      if (err) {
        return next(new UnauthorizedError("Authentication failed-"));
      }
      if (info instanceof TokenExpiredError) {
        return next(new jwtExpiredErr([`${info.expiredAt}`]));
      }
      if (info instanceof JsonWebTokenError) {
        return next(new BadRequestError(info.message));
      }
      if (info) {
        return next(new UnauthorizedError("Authentication failed"));
      }
      if (!admin) {
        return next(new UnauthorizedError("user not Authenticated."));
      }

      req.user = admin;
      next();
    };
  };

  public auth = () => async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, this.handleJwt(req, res, next))(req, res, next);
  };
}

const instance = Guard.get();

export { instance as Guard };
