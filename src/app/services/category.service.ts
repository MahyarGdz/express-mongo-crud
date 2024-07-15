import { Model, Types, isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../../common/types/app.Errors";
import { ICategory } from "../models/Abstraction/ICategory";
import category from "../models/category";
import { createCategoryDTO } from "../DTO/category/createCategory.dto";

class CategoryService {
  private static instance: CategoryService;
  private categoryModel: Model<ICategory> = category;
  private constructor() {}

  static get(): CategoryService {
    if (!this.instance) {
      this.instance = new CategoryService();
    }
    return this.instance;
  }

  public async getAll() {
    return await this.categoryModel.find({});
  }
  public async getOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const category = await this.categoryModel.findOne({ _id: new Types.ObjectId(id) });
    if (!category) throw new NotFoundError("the category not found by this id");
    return category;
  }
  public async create(category: createCategoryDTO) {
    return await this.categoryModel.create(category);
  }
  public async update(id: string, payload: Partial<createCategoryDTO>) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundError("the category not found by given id");
    return await this.categoryModel.updateOne({ _id: new Types.ObjectId(id) }, { $set: payload });
  }
  public async delete(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundError("the category not found by given id");
    return await this.categoryModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}

const instance = CategoryService.get();

export { instance as CategoryService };
