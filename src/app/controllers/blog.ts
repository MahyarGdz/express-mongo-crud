import { Request, Response } from "express";
import { BlogService } from "../services/blog.service";
import BaseController from "../../common/base/controller";
import { UploadedFile } from "express-fileupload";

class BlogController extends BaseController {
  private static instance: BlogController;
  private blogService = BlogService;
  private constructor() {
    super();
  }

  static get(): BlogController {
    if (!BlogController.instance) {
      BlogController.instance = new BlogController();
    }
    return BlogController.instance;
  }

  public async getAll(req: Request, res: Response) {
    const data = await this.blogService.getAll();
    return this.json({ req, res }, { data });
  }
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.blogService.getOne(id);
    return this.json({ req, res }, { data });
  }
  public async create(req: Request, res: Response) {
    const { body } = req;
    const data = await this.blogService.create(body);
    return this.json({ req, res }, { data }, 201);
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const payload = req.body;
    const data = await this.blogService.update(id, payload);
    return this.json({ req, res }, { data }, 201);
  }
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.blogService.delete(id);
    return this.json({ req, res }, { data });
  }

  public async upload(req: Request, res: Response) {
    const { file } = req;
    const data = await this.blogService.upload(file as UploadedFile);
    return this.json({ req, res }, { data });
  }
}

const instance = BlogController.get();

export { instance as BlogController };
