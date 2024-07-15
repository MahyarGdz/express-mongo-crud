import { CallbackError, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IAdmin } from "./Abstraction/IAdmin";

const adminSchema = new Schema<IAdmin>(
  {
    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 6, required: true },
    role: { type: Schema.Types.ObjectId, ref: "role", required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false }, id: false },
);

adminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

adminSchema
  .pre("findOne", function (next) {
    this.populate({ path: "role", select: { _id: 0, password: 0 } });
    next();
  })
  .pre("find", function (next) {
    this.populate({ path: "role", select: { _id: 0, password: 0 } });
    next();
  });

adminSchema.methods.comparePassword = async function (rawPassword: string): Promise<boolean> {
  const { password } = this;

  return await bcrypt.compare(rawPassword, password);
};

export default model<IAdmin>("admin", adminSchema);
