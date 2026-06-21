import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 }
      );
    }

    const post = await Post.findById(id)
      .populate("author", "name email image")
      .populate("category", "name slug");

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error("GET_POST_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 }
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          title: body.title,
          content: body.content,
          excerpt: body.excerpt,
          coverImage: body.coverImage,
          category: body.category,
          tags: body.tags,
          status: body.status,
          featured: body.featured,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (err: any) {
    console.error("PUT_POST_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 }
      );
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE_POST_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
