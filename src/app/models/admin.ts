import { CallbackError, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IAdmin } from "./Abstraction/IAdmin";

const adminSchema = new Schema<IAdmin>(
  {
    userName: { type: String, unique: true, required: [true, "userName is required"] },
    email: { type: String, unique: true, required: [true, "email is required"] },
    password: { type: String, minlength: 6, required: [true, "password is required"] },
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
    this.populate({ path: "role" });
    next();
  })
  .pre("find", function (next) {
    this.populate({ path: "role" });
    next();
  });

adminSchema.methods.comparePassword = async function (rawPassword: string): Promise<boolean> {
  const { password } = this;

  return await bcrypt.compare(rawPassword, password);
};

export default model<IAdmin>("admin", adminSchema);
