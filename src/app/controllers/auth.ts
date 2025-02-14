import BaseController from "../../common/base/controller";
import { Request, Response } from "express";
import { AuthSerivce } from "../services/auth.service";

class AuthController extends BaseController {
  private static instance: AuthController;
  private authService = AuthSerivce;
  private constructor() {
    super();
  }
  static get(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async register(req: Request, res: Response) {
    const { email, userName, password } = req.body;
    const msg = await this.authService.register({ email, userName, password });
    this.json({ req, res }, { msg }, 201);
  }
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const data = await this.authService.login({ email, password });
    this.json({ req, res }, { data });
  }
  //   public async logout(req: Request, res: Response) {}
}
const instance = AuthController.get();
export { instance as AuthController };
