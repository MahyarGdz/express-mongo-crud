import { Model, isValidObjectId } from "mongoose";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../common/types/app.Errors";
import { IAdmin } from "../models/Abstraction/IAdmin";
import admin from "../models/admin";
import { createAdminDTO } from "../DTO/admin/createAdmin.dto";
import { IRole } from "../models/Abstraction/IRole";
import role from "../models/role";
import { RoleEnum } from "../../common/enums/Role.enum";
import {
  BadRequestMessage,
  CreateMessage,
  DeleteMessage,
  ForbiddenMessage,
  NotFoundMessage,
  UpdateMessage,
} from "../../common/enums/messages.enum";

class AdminService {
  private static instance: AdminService;
  private adminModel: Model<IAdmin> = admin;
  private roleModel: Model<IRole> = role;
  private constructor() {}

  static get(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }
  public async getAll() {
    //get all admins
    return await this.adminModel.find({}, { password: 0 });
  }

  public async getOne(id: string) {
    //get one admin with its id and send it back to response
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
    //we can use lean method also to convert it to js object for result
    const admin = await this.adminModel.findOne({ _id: id }, { password: 0 });
    if (!admin) throw new NotFoundError(NotFoundMessage.AdminNotFound);
    // turn the admin object to js object and omit the extra field from result
    return admin.toJSON();
  }
  /**
   * @param data
   *  only super admin can create admin and default new admins are not active
   */
  public async create(data: createAdminDTO) {
    //find role to set the default role of admin to visitor
    const Role = await this.roleModel.findOne({ name: RoleEnum.VISITOR }, { _id: 1 });

    data.role = Role?._id?.toString();
    data.isActive = false;

    const newAdmin = await this.adminModel.create(data);
    return {
      message: CreateMessage.AdminCreated,
      data: {
        id: newAdmin._id,
        userName: newAdmin.userName,
        email: newAdmin.email,
        adminIsActive: newAdmin.isActive,
      },
    };
  }
  /**
   *
   * @param id
   * @param payload
   *  update admin by given id . only super admin can request to this endpoint
   */
  public async update(id: string, payload: Partial<createAdminDTO>) {
    // check if id is valid object id
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);

    if (payload.role) {
      const role = await this.roleModel.findOne({ name: payload.role });
      if (!role) throw new BadRequestError(BadRequestMessage.RoleNotFound);
      payload.role = role?._id as string;
    }

    // //update admin and return the updated admin document
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(id, payload, { new: true, projection: { password: 0, __v: 0 } });
    //fail if upadted admin was null
    if (!updatedAdmin) throw new NotFoundError(NotFoundMessage.AdminNotFound);

    return {
      message: UpdateMessage.Updated,
      updatedAdmin,
    };
  }
  /**
   *
   * @param id
   * only super admins can request to this endpoint
   */
  public async delete(id: string, self: IAdmin) {
    if (!isValidObjectId(id)) throw new BadRequestError(BadRequestMessage.ID_IS_NOT_Valid);
    //check if admin try to delete it self and throw error
    if (id == self._id) throw new ForbiddenError(ForbiddenMessage.CanNotDeleteSelf);

    const deletedAdmin = await this.adminModel.findOneAndDelete({ _id: id }, { projection: { email: 1, userName: 1 } });

    if (!deletedAdmin) throw new NotFoundError(NotFoundMessage.AdminNotFound);

    return {
      message: DeleteMessage.AdminDelete,
      deletedAdmin,
    };
  }
}

const instance = AdminService.get();

export { instance as AdminService };
