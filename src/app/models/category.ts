import { Schema, model } from "mongoose";
import { ICategory } from "./Abstraction/ICategory";

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // url: { type: String, required: true },
});

export default model<ICategory>("category", categorySchema);
