import { getAuthUser } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true } // Return updated post to include new view count
    )
      .populate({
        path: "author",
        select: "name email avatar",
      })
      .populate({
        path: "category",
        select: "name slug",
      })
      .lean();

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = getAuthUser(req);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // OPTIONAL: only author can update
    if (post.author.toString() !== session.sub) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // update fields safely
    const allowedFields = [
      "title",
      "content",
      "excerpt",
      "coverImage",
      "media",
      "tags",
      "status",
      "category",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        (post as any)[field] = body[field];
      }
    });

    // auto publish date logic
    if (body.status === "published" && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();

    return NextResponse.json({
      message: "Post updated successfully",
      data: post,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = getAuthUser(req);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // OPTIONAL: only author can delete
    if (post.author.toString() !== session.sub) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    await post.deleteOne();

    return NextResponse.json({
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}