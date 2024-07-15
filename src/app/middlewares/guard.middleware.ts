import { NextFunction, Response, Request } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import passport from "passport";
import RoleModel from "../models/role";
import { BadRequestError, ForbiddenError, UnauthorizedError, jwtExpiredErr } from "../../common/types/app.Errors";
import { IAdmin } from "../models/Abstraction/IAdmin";

class Guard {
  private static instance: Guard;
  private roleModel = RoleModel;
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

  public can = (permissions: string[]) => async (req: Request, _res: Response, next: NextFunction) => {
    const admin = req.user as IAdmin;
    if (!admin.isActive) next(new ForbiddenError("Access denied"));

    const role = await this.roleModel.findOne(admin?.role?._id);
    const hasPermission = permissions.every((permission) => role?.permissions.includes(permission));

    if (!hasPermission) next(new ForbiddenError("Access denied!"));
    next();
  };
}

const instance = Guard.get();

export { instance as Guard };
