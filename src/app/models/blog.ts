import { Schema, model } from "mongoose";
import { IBlog } from "./Abstraction/IBlog";
import slugify from "slugify";

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: [true, "please send name"], maxlength: [20, "title can not be more than 20 char"] },
    slug: { type: String },
    content: { type: String, required: [true, "please fill content"], maxlength: [500, "title can not be more than 20 char"] },
    imageUrl: { type: String, default: `/images/default.jpg` },
    category: { type: Schema.Types.ObjectId, ref: "category", required: [true, "please send categoryID"] },
    author: { type: Schema.Types.ObjectId, ref: "admin", required: [true, "please send auhtorID"] },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false }, id: false },
);

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
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

// blogSchema.virtual("authorDetails", {
//   ref: "admin",
//   localField: "author",
//   foreignField: "_id",
//   justOne: true,
// });

// blogSchema.virtual("categoryDetails", {
//   ref: "category", // The model to use
//   localField: "category", // Find in model, where localField
//   foreignField: "_id", // is equal to foreignField
//   justOne: true, // Return one document
// });
