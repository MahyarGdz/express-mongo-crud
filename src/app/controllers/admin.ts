import { Request, Response } from "express";
import BaseController from "../../common/base/controller";
import { AdminService } from "../services/admin.service";

class AdminController extends BaseController {
  private static instance: AdminController;
  private adminService = AdminService;
  private constructor() {
    super();
  }

  static get(): AdminController {
    if (!this.instance) {
      this.instance = new AdminController();
    }
    return this.instance;
  }

  public async getAll(req: Request, res: Response) {
    const admins = await this.adminService.getAll();
    return this.json({ req, res }, admins);
  }
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const admin = await this.adminService.getOne(id);
    return this.json({ req, res }, admin);
  }
  public async create(req: Request, res: Response) {
    const { body } = req;
    const msg = await this.adminService.create(body);
    return this.json({ req, res }, msg, 201);
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const payload = req.body;
    const msg = await this.adminService.update(id, payload);
    return this.json({ req, res }, msg, 201);
  }
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const msg = await this.adminService.delete(id);
    return this.json({ req, res }, msg);
  }
}

const instance = AdminController.get();

export { instance as AdminController };
