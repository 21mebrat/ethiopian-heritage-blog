import { Schema, model, models } from "mongoose";
import { ICategory } from "../types";

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [80, "Category name cannot exceed 80 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe"],
    },
    description: {
      type: String,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
// Already handled by unique: true in schema

const Category = models.Category || model<ICategory>("Category", CategorySchema);
export default Category;