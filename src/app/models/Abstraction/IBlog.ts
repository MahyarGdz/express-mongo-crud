import { Document, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  category: Types.ObjectId;
  author: Types.ObjectId;
}
