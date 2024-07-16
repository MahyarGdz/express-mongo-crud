import { Request, Response } from "express";
import BaseController from "../../common/base/controller";
import { CategoryService } from "../services/category.service";

class CategoryController extends BaseController {
  private static instance: CategoryController;
  private categoryService = CategoryService;

  private constructor() {
    super();
  }
  static get(): CategoryController {
    if (!this.instance) {
      this.instance = new CategoryController();
    }
    return this.instance;
  }

  public async getAll(req: Request, res: Response) {
    const categories = await this.categoryService.getAll();
    return this.json({ req, res }, categories);
  }
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const category = await this.categoryService.getOne(id);
    return this.json({ req, res }, category);
  }
  public async create(req: Request, res: Response) {
    const { body } = req;
    const msg = await this.categoryService.create(body);
    return this.json({ req, res }, msg, 201);
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const payload = req.body;
    const msg = await this.categoryService.update(id, payload);
    return this.json({ req, res }, msg, 201);
  }
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const msg = await this.categoryService.delete(id);
    return this.json({ req, res }, msg, 201);
  }
}

const instance = CategoryController.get();

export { instance as CategoryController };
