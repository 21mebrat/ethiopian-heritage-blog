import { Schema, model, models } from "mongoose";
import { IPost } from "../types";
import "./category";
import "./user";

const MediaSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "file"], default: "image" },
    altText: { type: String, default: null },
  },
  { _id: false } 
);

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe"],
    },

    content: {
      type: Schema.Types.Mixed,
      required: [true, "Content is required"],
    },

    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      default: null,
    },
    coverImage: {
    type: String,
    default: null,
    },
    media: {
      type: [MediaSchema],
      default: [],
      validate: {
        validator: (val: any[]) => val.length <= 20,
        message: "Max 20 media items allowed",
      },
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: "Max 10 tags allowed",
      },
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    views: { type: Number, default: 0 },

    publishedAt: { type: Date, default: null },

    readingTime: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ status: 1 });

const Post = models.Post || model<IPost>("Post", PostSchema);
export default Post;