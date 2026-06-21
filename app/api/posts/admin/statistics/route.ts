import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";

export async function GET() {
  try {
    await connectDB();

    const [totalPosts, publishedPosts, draftPosts, totalViews] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      Post.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$views" },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews[0]?.total || 0,
      },
    });
  } catch (err: any) {
    console.error("GET_POST_STATISTICS_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
