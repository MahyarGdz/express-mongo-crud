import passport from "passport";
import { ExtractJwt, StrategyOptionsWithoutRequest, Strategy as JwtStrategy } from "passport-jwt";
import ENV from "../../config/env.config";
import { AuthSerivce } from "../services/auth.service";

class Authenticate {
  private static instance: Authenticate;
  private authService = AuthSerivce;
  private jwtOption: StrategyOptionsWithoutRequest = {
    secretOrKey: ENV.JWT_SECRET || "",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  private constructor() {}

  static get(): Authenticate {
    if (!this.instance) {
      this.instance = new Authenticate();
    }
    return this.instance;
  }

  public init() {
    return passport.initialize();
  }

  public plug() {
    passport.use("jwt", new JwtStrategy(this.jwtOption, this.authService.jwt));
  }
}

const authenticate = Authenticate.get();

export { authenticate as Authenticate };
