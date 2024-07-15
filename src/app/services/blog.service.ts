import { Model, Types, isValidObjectId } from "mongoose";
import { IBlog } from "../models/Abstraction/IBlog";
import blog from "../models/blog";
import { BadRequestError, NotFoundError } from "../../common/types/app.Errors";
import { createBlogDTO } from "../DTO/blog/createBlog.dto";

class BlogService {
  private static instance: BlogService;
  private blogModel: Model<IBlog> = blog;
  private constructor() {}

  static get(): BlogService {
    if (!this.instance) {
      this.instance = new BlogService();
    }
    return this.instance;
  }
  public async getAll() {
    return await this.blogModel.find({});
  }
  public async getOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const blog = await this.blogModel.findOne({ _id: new Types.ObjectId(id) });
    if (!blog) throw new NotFoundError("the blog not found by this id");
    return blog;
  }
  public async create(blog: createBlogDTO) {
    return await this.blogModel.create(blog);
  }
  public async update(id: string, payload: Partial<createBlogDTO>) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundError("the blog not found by given id");
    return await this.blogModel.updateOne({ _id: new Types.ObjectId(id) }, { $set: payload });
  }
  public async delete(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundError("the blog not found by given id");
    return await this.blogModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}

const instance = BlogService.get();

export { instance as BlogService };
