import { Document, Types } from "mongoose";

export interface IAdmin extends Document {
  userName: string;
  email: string;
  password: string;
  role: Types.ObjectId;
  isActive: boolean;
  comparePassword: (rawPassword: string) => Promise<boolean>;
}
