import { Model, Types, isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../../common/types/app.Errors";
import { IAdmin } from "../models/Abstraction/IAdmin";
import admin from "../models/admin";
import { createAdminDTO } from "../DTO/admin/createAdmin.dto";
import { IRole } from "../models/Abstraction/IRole";
import role from "../models/role";
import { RoleEnum } from "../../common/enums/Role.enum";

class AdminService {
  private static instance: AdminService;
  private adminModel: Model<IAdmin> = admin;
  private roleModel: Model<IRole> = role;
  private constructor() {}

  static get(): AdminService {
    if (!this.instance) {
      this.instance = new AdminService();
    }
    return this.instance;
  }
  public async getAll() {
    //get all admins
    return await this.adminModel.find({});
  }
  public async getOne(id: string) {
    //get one admin with its id and send it back to response
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const admin = await this.adminModel.findOne({ _id: new Types.ObjectId(id) });
    if (!admin) throw new NotFoundError("the admin not found by given id");
    return admin;
  }
  public async create(admin: createAdminDTO) {
    //find role to set the default role of admin to visitor
    const Role = await this.roleModel.findOne({ name: RoleEnum.VISITOR });
    admin.role = Role?._id as string;
    admin.isActive = false;

    return await this.adminModel.create(admin);
  }
  public async update(id: string, payload: Partial<createAdminDTO>) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const admin = await this.adminModel.findById(id);
    if (!admin) throw new NotFoundError("the admin not found by given id");
    return await this.adminModel.updateOne({ _id: new Types.ObjectId(id) }, { $set: payload });
  }
  public async delete(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestError("the id is not valid");
    const admin = await this.adminModel.findById(id);
    if (!admin) throw new NotFoundError("the admin not found by given id");
    return await this.adminModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}

const instance = AdminService.get();

export { instance as AdminService };
