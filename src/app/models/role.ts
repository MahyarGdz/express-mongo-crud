import { Schema, model } from "mongoose";
import { IRole } from "./Abstraction/IRole";
import { RoleEnum } from "../../common/enums/Role.enum";

const roleSchema = new Schema<IRole>({
  name: { type: String, enum: RoleEnum, default: RoleEnum.VISITOR },
  permissions: { type: [String], required: true },
});

export default model<IRole>("role", roleSchema);
