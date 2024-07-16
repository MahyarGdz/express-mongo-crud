import { Schema, model } from "mongoose";
import { ICategory } from "./Abstraction/ICategory";

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false }, id: false },
);

categorySchema.virtual("url").get(function () {
  return `/${this.name}`;
});

export default model<ICategory>("category", categorySchema);
