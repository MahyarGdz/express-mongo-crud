import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Logger } from "../../logging/logger";
import { jwtExpiredErr } from "../../common/types/app.Errors";
import { AuthTokenPayload } from "../../common/types/tokenPayload";

const logger = new Logger();

class TokenService {
  private static instance: TokenService;
  private static jwtSecret: string = process.env.JWT_SECRET || "";
  private jwt_token_expire: string = process.env.JWT_TOKEN_EXPIRE || "2";
  private constructor() {}
  static get(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public generateToken(payload: AuthTokenPayload) {
    const token = jwt.sign(payload, TokenService.jwtSecret, { expiresIn: `${this.jwt_token_expire}h` });
    return {
      token,
      expires: Date.now() + +this.jwt_token_expire * 60 * 60 * 1000,
    };
  }

  public verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, TokenService.jwtSecret);
      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new jwtExpiredErr();
      logger.error("error is :", error);
      throw error;
    }
  }
}

const instance = TokenService.get();
export { instance as TokenService };
