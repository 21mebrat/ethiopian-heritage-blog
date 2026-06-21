import { Schema, model, models } from "mongoose";
import { IComment } from "../types";
const CommentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post reference is required"],
    },
    user_info: {
      name: {
        type: String,
        required: [true, "User name is required"],
      },
      email: {
        type: String,
        required: [true, "User email is required"],
      },
      phone: {
        type: String,
      },
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [2, "Comment must be at least 2 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    isvisible: {
      type: Boolean,
      default: false,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
CommentSchema.index({ post: 1 });
CommentSchema.index({ post: 1, isvisible: 1 });
CommentSchema.index({ parentComment: 1 });

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);
export default Comment;