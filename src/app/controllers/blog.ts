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
  public async getOneById(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.blogService.getOneById(id);
    return this.json({ req, res }, { data });
  }
  public async getOneBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const data = await this.blogService.getOneBySlug(slug);
    return this.json({ req, res }, { data });
  }
  public async getByCategory(req: Request, res: Response) {
    const { name } = req.params;
    const data = await this.blogService.getByCategory(name);
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
    const { id } = req.params;
    const data = await this.blogService.upload(file as UploadedFile, id);
    return this.json({ req, res }, { data });
  }
}

const instance = BlogController.get();

export { instance as BlogController };
