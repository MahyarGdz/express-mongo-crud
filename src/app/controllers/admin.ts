import { Request, Response } from "express";
import BaseController from "../../common/base/controller";
import { AdminService } from "../services/admin.service";
import { IAdmin } from "../models/Abstraction/IAdmin";

class AdminController extends BaseController {
  private static instance: AdminController;
  private adminService = AdminService;
  private constructor() {
    super();
  }

  static get(): AdminController {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController();
    }
    return AdminController.instance;
  }

  public async getAll(req: Request, res: Response) {
    const data = await this.adminService.getAll();
    return this.json({ req, res }, { data });
  }
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.adminService.getOne(id);
    return this.json({ req, res }, { data });
  }
  public async create(req: Request, res: Response) {
    const { body } = req;
    const msg = await this.adminService.create(body);
    return this.json({ req, res }, { msg }, 201);
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const payload = req.body;
    const data = await this.adminService.update(id, payload);
    return this.json({ req, res }, { data }, 201);
  }
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const self = req.user as IAdmin;
    const data = await this.adminService.delete(id, self);
    return this.json({ req, res }, { data });
  }
}

const instance = AdminController.get();

export { instance as AdminController };
