"use server";

import { connectDB } from "@/app/lib/db";
import Category from "@/app/models/category";

export async function getCategories() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .select("_id name slug")
      .sort({ name: 1 })
      .lean();

    return categories;
  } catch (error) {
    console.error("GET_CATEGORIES_ERROR:", error);
    return [];
  }
}
