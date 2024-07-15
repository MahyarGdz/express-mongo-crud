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
    if (!this.instance) {
      this.instance = new AuthController();
    }
    return this.instance;
  }

  public async register(req: Request, res: Response) {
    const { body } = req;
    const msg = await this.authService.register(body);
    this.json({ req, res }, msg, 201);
  }
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const data = await this.authService.login({ email, password });
    this.json({ req, res }, data);
  }
  //   public async logout(req: Request, res: Response) {}
}
const instance = AuthController.get();
export { instance as AuthController };
