import { Model, isValidObjectId } from "mongoose";
import { extname } from "path";
import { randomBytes } from "crypto";
import { IBlog } from "../models/Abstraction/IBlog";
import blog from "../models/blog";
import { BadRequestError, InternalError, NotFoundError } from "../../common/types/app.Errors";
import { createBlogDTO } from "../DTO/blog/createBlog.dto";
import { UploadedFile } from "express-fileupload";
import ENV from "../../config/env.config";
import {
  BadRequestMessage,
  CreateMessage,
  DeleteMessage,
  NotFoundMessage,
  UpdateMessage,
  UploadMessage,
} from "../../common/enums/messages.enum";

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
  //get all blogs
  public async getAll() {
    return await this.blogModel.find({});
  }
  //get blog by id
  public async getOneById(id: string) {
    //check if id is valid object id
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);

    const blog = await this.blogModel.findOne({ _id: id });
    //throw error if blog not found
    if (!blog) throw new NotFoundError(NotFoundMessage.BlogNotFound);

    return blog.toJSON();
  }
  //
  public async getOneBySlug(slug: string) {
    const blog = await this.blogModel.findOne({ slug });
    //throw error if blog not found
    if (!blog) throw new NotFoundError(NotFoundMessage.BlogNotFoundBySlug);
    //
    return blog.toJSON();
  }
  //find all blogs based on category
  public async getByCategory(slug: string) {
    console.log(slug);
    const blog = await this.blogModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $unwind: "$author",
      },
      {
        $addFields: {
          categorySlug: "$category.slug",
          authorName: "$author.userName",
        },
      },
      {
        $project: {
          author: 0,
          category: 0,
          __v: 0,
        },
      },
      {
        $match: {
          categorySlug: slug,
        },
      },
    ]);

    //throw error if blog not found
    // if (blog.length === 0) throw new NotFoundError(NotFoundMessage.BlogNotFoundByCategor);
    //
    return blog;
  }
  //create blog and only admin with needed permission can create blog
  public async create(data: createBlogDTO) {
    const newBlog = await this.blogModel.create(data);
    return {
      message: CreateMessage.blogCreated,
      newBlog,
    };
  }
  // upadate the existant blog with its id and payload
  public async update(id: string, payload: Partial<createBlogDTO>) {
    //check if id is valid object id
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
    //find and update with id and if return null, throw  not found error
    const updatedBlog = await this.blogModel.findOneAndUpdate({ _id: id }, { $set: payload }, { new: true });

    if (!updatedBlog) throw new NotFoundError(NotFoundMessage.BlogNotFound);

    return {
      message: UpdateMessage.BlogUpdated,
      updatedBlog,
    };
  }
  //delete blog by its id
  public async delete(id: string) {
    //check if id is valid object id
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
    //find by id and delete .if not found return null then throw not found error
    const deletedBlog = await this.blogModel.findByIdAndDelete({ _id: id });

    if (!deletedBlog) throw new NotFoundError(NotFoundMessage.BlogNotFound);

    return {
      message: DeleteMessage.CategoryDelete,
      deletedBlog,
    };
  }

  public async upload(file: UploadedFile, blogId: string) {
    //check if id is valid object id
    if (!isValidObjectId(blogId)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
    //if blog not found throw and error
    let blog = await this.blogModel.findById(blogId);

    if (!blog) throw new NotFoundError(NotFoundMessage.BlogNotFound);
    //create a file name for the uploaded file
    const fileName = `${randomBytes(10).toString("hex")}-${blogId}${extname(file.name)}`;
    file.mv(`${process.cwd()}/${ENV.UPLOADS_FOLDERS}${fileName}`, async (err) => {
      if (err) throw new InternalError(["problem with uploading file"]);

      blog = await this.blogModel.findByIdAndUpdate(blogId, { imageUrl: `/images/${fileName}` });
    });
    return {
      message: UploadMessage.FileUpload,
      link: blog.imageUrl,
    };
  }
}

const instance = BlogService.get();

export { instance as BlogService };
