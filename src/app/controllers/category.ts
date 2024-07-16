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
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController();
    }
    return CategoryController.instance;
  }

  public async getAll(req: Request, res: Response) {
    const data = await this.categoryService.getAll();
    return this.json({ req, res }, { data });
  }
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.categoryService.getOne(id);
    return this.json({ req, res }, { data });
  }
  public async create(req: Request, res: Response) {
    const { name, description } = req.body;
    const data = await this.categoryService.create({ name, description });
    return this.json({ req, res }, { data }, 201);
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const payload = req.body;
    const data = await this.categoryService.update(id, payload);
    return this.json({ req, res }, { data }, 201);
  }
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.categoryService.delete(id);
    return this.json({ req, res }, { data });
  }
}

const instance = CategoryController.get();

export { instance as CategoryController };
