import { Schema, model } from "mongoose";
import { ICategory } from "./Abstraction/ICategory";
import slugify from "slugify";

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    slug: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false }, id: false },
);

categorySchema.virtual("url").get(function () {
  return `/api/blogs/category/${this.slug}`;
});

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as ICategory;
  const payload = update.$set as { [k: string]: any };

  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true });
  }
  next();
});
categorySchema.virtual("blogs", {
  ref: "blog",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

export default model<ICategory>("category", categorySchema);
