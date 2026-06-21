import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { POST_POPULATION } from "@/app/types";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

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

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("GET_ADMIN_POSTS_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
