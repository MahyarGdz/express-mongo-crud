import { Model, Types, isValidObjectId } from "mongoose";
import { IBlog } from "../models/Abstraction/IBlog";
import blog from "../models/blog";
import { BadRequestError, NotFoundError } from "../../common/types/app.Errors";
import { createBlogDTO } from "../DTO/blog/createBlog.dto";
import { UploadedFile } from "express-fileupload";
import ENV from "../../config/env.config";
import { BadRequestMessage, CreateMessage, NotFoundMessage } from "../../common/enums/messages.enum";

class BlogService {
  private static instance: BlogService;
  private blogModel: Model<IBlog> = blog;
  private constructor() {}

  static get(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }
  public async getAll() {
    return await this.blogModel.find({});
  }
  public async getOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);

    const blog = await this.blogModel.findOne({ _id: id });
    //throw error if category not found
    if (!blog) throw new NotFoundError(NotFoundMessage.BlogNotFound);
    //
    return blog.toJSON();
  }
  public async create(data: createBlogDTO) {
    const newBlog = await this.blogModel.create(data);
    return {
      message: CreateMessage.blogCreated,
      newBlog,
    };
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

  public async upload(file: UploadedFile) {
    console.log(file);
    console.log(process.cwd() + "/" + ENV.UPLOADS_FOLDERS + file.name);

    file.mv(process.cwd() + "/" + ENV.UPLOADS_FOLDERS + file.name);
    return {
      message: "file uploaded",
    };
  }
}

const instance = BlogService.get();

export { instance as BlogService };
