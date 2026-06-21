"use server";

import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { POST_POPULATION } from "@/app/types";
import mongoose from "mongoose";

export async function getPosts(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  sort?: string;
}) {
  try {
    await connectDB();
    
    const { page = 1, limit = 10, search = "", status = "", category = "", sort = "newest" } = params;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (category && category !== "all") {
      query.category = new mongoose.Types.ObjectId(category);
    }

    // Build sort
    let sortObj: any = {};
    switch (sort) {
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "most_viewed":
        sortObj = { views: -1 };
        break;
      case "recently_updated":
        sortObj = { updatedAt: -1 };
        break;
      case "newest":
      default:
        sortObj = { createdAt: -1 };
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate(POST_POPULATION.author)
        .populate(POST_POPULATION.category)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query)
    ]);

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("GET_POSTS_ERROR:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}
