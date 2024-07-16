import { Model, Types, isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../../common/types/app.Errors";
import { ICategory } from "../models/Abstraction/ICategory";
import category from "../models/category";
import { createCategoryDTO } from "../DTO/category/createCategory.dto";
import { BadRequestMessage, CreateMessage, DeleteMessage, NotFoundMessage, UpdateMessage } from "../../common/enums/messages.enum";

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

  //get all category
  public async getAll() {
    return await this.categoryModel.find({});
  }
  //get one doc from the docs with its id
  public async getOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);

    const category = await this.categoryModel.findOne({ _id: new Types.ObjectId(id) });
    //throw error if category not found
    if (!category) throw new NotFoundError(NotFoundMessage.CategoryNotFound);
    //
    return category.toJSON();
  }

  //create category
  public async create(data: createCategoryDTO) {
    const category = await this.categoryModel.create(data);
    return {
      message: CreateMessage.CategoryCreated,
      category,
    };
  }
  public async update(id: string, payload: Partial<createCategoryDTO>) {
    //check is id is valid
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
    //find and update with id and if return null throw and not found error
    const updatedCategory = await this.categoryModel.findByIdAndUpdate({ _id: id }, { $set: payload }, { new: true });

    if (!updatedCategory) throw new NotFoundError(NotFoundMessage.CategoryNotFound);

    return {
      message: UpdateMessage.CategoryUpdated,
      updatedCategory,
    };
  }
  public async delete(id: string) {
    //check if the id is valid object id
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
    //find by id and delete .if not found return null then throw not found error
    const deletedCategory = await this.categoryModel.findByIdAndDelete({ _id: id });

    if (!deletedCategory) throw new NotFoundError(NotFoundMessage.CategoryNotFound);

    return {
      message: DeleteMessage.CategoryDelete,
      deletedCategory,
    };
  }
}

const instance = CategoryService.get();

export { instance as CategoryService };
