import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  tag?: string;
  date: Date;
}

const PostsSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Posts = mongoose.model<IPost>("Posts", PostsSchema);

export default Posts;
