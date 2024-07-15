import { Request, Response } from "express";
import { BlogService } from "../services/blog.service";
import BaseController from "../../common/base/controller";

class BlogController extends BaseController {
  private static instance: BlogController;
  private blogService = BlogService;
  private constructor() {
    super();
  }

  static get(): BlogController {
    if (!this.instance) {
      this.instance = new BlogController();
    }
    return this.instance;
  }

  public async getAll(req: Request, res: Response) {
    const blogs = await this.blogService.getAll();
    return this.json({ req, res }, blogs);
  }
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const blog = await this.blogService.getOne(id);
    return this.json({ req, res }, blog);
  }
  public async create(req: Request, res: Response) {
    const { body } = req;
    const msg = await this.blogService.create(body);
    return this.json({ req, res }, msg, 201);
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const payload = req.body;
    const msg = await this.blogService.update(id, payload);
    return this.json({ req, res }, msg);
  }
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const msg = await this.blogService.delete(id);
    return this.json({ req, res }, msg);
  }
}

const instance = BlogController.get();

export { instance as BlogController };
