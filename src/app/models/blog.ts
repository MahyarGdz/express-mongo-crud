import { Schema, model } from "mongoose";
import { IBlog } from "./Abstraction/IBlog";

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "category", required: true },
    author: { type: Schema.Types.ObjectId, ref: "admin", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false } },
);

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

// populate both author and category details
blogSchema
  .pre("findOne", function (next) {
    this.populate([
      { path: "category", select: { id: 0 } },
      { path: "author", select: { id: 0 } },
    ]);
    next();
  })
  .pre("find", function (next) {
    this.populate([
      { path: "category", select: { id: 0 } },
      { path: "author", select: { id: 0 } },
    ]);
    next();
  });

export default model<IBlog>("blog", blogSchema);
