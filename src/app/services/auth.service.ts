import { Model } from "mongoose";
import AdminModel from "../models/admin";
import RoleModel from "../models/role";
import { RegisterDTO } from "../DTO/auth/register.dto";
import { TokenService } from "./token.service";
import { IAdmin } from "../models/Abstraction/IAdmin";
import { IRole } from "../models/Abstraction/IRole";
import { RoleEnum } from "../../common/enums/Role.enum";
import { LoginDto } from "../DTO/auth/login.dto";
import { BadRequestError } from "../../common/types/app.Errors";

class AuthSerivce {
  private static instance: AuthSerivce;
  private tokenService = TokenService;
  private adminModel: Model<IAdmin> = AdminModel;
  private roleModel: Model<IRole> = RoleModel;
  private constructor() {}
  static get(): AuthSerivce {
    if (!this.instance) {
      this.instance = new AuthSerivce();
    }
    return this.instance;
  }

  public async register(data: RegisterDTO) {
    let adminRole = await this.roleModel.findOne({ name: RoleEnum.VISITOR });
    if (!adminRole) {
      adminRole = new this.roleModel({
        name: RoleEnum.VISITOR,
        permissions: ["read"],
      });
      await adminRole.save();
    }

    const newAdmin = new AdminModel({
      userName: data.userName,
      email: data.email,
      password: data.password,
      role: adminRole._id,
      isActive: false,
    });

    await newAdmin.save();
    return {
      message: "admin created. please wait for approvment!",
      newAdmin,
    };
  }

  public async login(data: LoginDto) {
    const admin = await this.adminModel.findOne({ email: data.email });
    if (!admin || !admin.comparePassword(data.password)) throw new BadRequestError("email or password is incorrect");

    const passMatch = await admin.comparePassword(data.password);
    console.log(passMatch);

    if (!passMatch) throw new BadRequestError("email or password is incorrect");

    const token = this.tokenService.generateToken({ sub: admin._id as string });

    return {
      message: "login successfully!",
      token,
    };
  }
}

const authSrv = AuthSerivce.get();
export { authSrv as AuthSerivce };
