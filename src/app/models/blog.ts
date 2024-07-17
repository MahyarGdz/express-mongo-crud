import { Schema, model } from "mongoose";
import { IBlog } from "./Abstraction/IBlog";
import slugify from "slugify";

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: [true, "please send name"], minlength: [4, "title can not be less than 4 char"] },
    slug: { type: String },
    content: { type: String, required: [true, "please fill content"] },
    imageUrl: { type: String, default: `/images/default.jpg` },
    category: { type: Schema.Types.ObjectId, ref: "category", required: [true, "please send categoryID"] },
    author: { type: Schema.Types.ObjectId, ref: "admin", required: [true, "please send auhtorID"] },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false }, id: false },
);

blogSchema.virtual("link").get(function () {
  return `/api/blogs/${this.slug}`;
});

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

blogSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as IBlog;
  const payload = update.$set as { [k: string]: any };

  if (payload.title) {
    payload.slug = slugify(payload.title, { lower: true });
  }
  next();
});
// populate both author and category details
blogSchema
  .pre("findOne", function (next) {
    this.populate([{ path: "category" }, { path: "author", select: { userName: 1, role: 0 } }]);
    next();
  })
  .pre("find", function (next) {
    this.populate([{ path: "category" }, { path: "author", select: { userName: 1, role: 0 } }]);
    next();
  });

export default model<IBlog>("blog", blogSchema);
