import { Schema, model, models } from "mongoose";
import { IMedia } from "../types";
const MediaSchema = new Schema<IMedia>(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Media type is required"],
    },
    format: {
      type: String,
      trim: true,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    altText: {
      type: String,
      maxlength: [200, "Alt text cannot exceed 200 characters"],
      default: null,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader reference is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
MediaSchema.index({ uploadedBy: 1 });
MediaSchema.index({ type: 1 });
MediaSchema.index({ createdAt: -1 });


const Media = models.Media || model<IMedia>("Media", MediaSchema);
export default Media;