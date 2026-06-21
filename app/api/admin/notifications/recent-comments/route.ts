import { connectDB } from "@/app/lib/db";
import Comment from "@/app/models/comment";
import Post from "@/app/models/post";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Fetch the 5 most recent comments, populated with post info
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("post", "title slug")
      .lean();

    const notifications = recentComments.map((comment: any) => ({
      id: comment._id.toString(),
      title: "New Comment",
      message: `${comment.user_info.name} replied on "${comment.post?.title || "a post"}"`,
      time: comment.createdAt,
      type: "info" as const,
      read: comment.isvisible, // We can use visibility as a proxy or just mark all as unread for the notification bar
      link: `/admin/comments`,
    }));

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
