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
import { AuthTokenPayload } from "../../common/types/tokenPayload";
import { VerifiedCallback } from "passport-jwt";
import { Logger } from "../../logging/logger";
import { AuhtMessage, CreateMessage } from "../../common/enums/messages.enum";

class AuthSerivce {
  private static instance: AuthSerivce;
  private logger = new Logger();
  private tokenService = TokenService;
  private adminModel: Model<IAdmin> = AdminModel;
  private roleModel: Model<IRole> = RoleModel;
  private constructor() {}
  static get(): AuthSerivce {
    if (!AuthSerivce.instance) {
      AuthSerivce.instance = new AuthSerivce();
    }
    return AuthSerivce.instance;
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
      message: CreateMessage.Register,
      data: {
        userName: newAdmin.userName,
        email: newAdmin.email,
        adminIsActive: newAdmin.isActive,
        role: adminRole.name,
        permission: adminRole.permissions.join(","),
      },
    };
  }

  public async login(data: LoginDto) {
    const admin = await this.adminModel.findOne({ email: data.email });
    if (!admin) throw new BadRequestError(AuhtMessage.IncorrectMessage);

    const passMatch = await admin.comparePassword(data.password);

    if (!passMatch) throw new BadRequestError(AuhtMessage.IncorrectMessage);

    const token = this.tokenService.generateToken({ sub: admin._id as string });

    return {
      message: AuhtMessage.LoginSuccessfull,
      token,
    };
  }

  public jwt = async (payload: AuthTokenPayload, done: VerifiedCallback) => {
    try {
      const admin = await this.adminModel.findOne({ _id: payload.sub }, { password: 0 });

      if (!admin) {
        return done(null, false);
      }
      done(null, admin);
    } catch (error) {
      this.logger.error("Error happen in jwt service in auth service", error);
      done(error, false);
    }
  };
}

const instance = AuthSerivce.get();
export { instance as AuthSerivce };
