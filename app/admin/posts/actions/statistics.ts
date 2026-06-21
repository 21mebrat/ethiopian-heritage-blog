"use server";

import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";

export async function getStatistics() {
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

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews[0]?.total || 0,
    };
  } catch (error) {
    console.error("GET_STATISTICS_ERROR:", error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
    };
  }
}
