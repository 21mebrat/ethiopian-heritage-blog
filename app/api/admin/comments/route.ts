import { connectDB } from "@/app/lib/db";
import Comment from "@/app/models/comment";
import Post from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all"; // all, visible, hidden
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const query: any = {};

    if (status === "visible") query.isvisible = true;
    if (status === "hidden") query.isvisible = false;

    if (search) {
      query.$or = [
        { content: { $regex: search, $options: "i" } },
        { "user_info.name": { $regex: search, $options: "i" } },
        { "user_info.email": { $regex: search, $options: "i" } },
      ];
    }

    const comments = await Comment.find(query)
      .populate({
        path: "post",
        select: "title slug",
        model: Post
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("ADMIN_COMMENTS_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
