import { connectDB } from "@/app/lib/db";
import Comment from "@/app/models/comment";
import Post from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      post,
      content,
      parentComment,
      user_info,
    } = body;

    if (!post) {
      return NextResponse.json(
        { message: "Post is required" },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    if (!user_info?.name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!user_info?.email?.trim()) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }


    const existingPost = await Post.findById(post);

    if (!existingPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }


    const comment = await Comment.create({
      post,
      content,
      parentComment: parentComment || null,

      user_info: {
        name: user_info.name,
        email: user_info.email,
        phone: user_info.phone || null,
      },

      // admin approves later
      isvisible: true,
    });

    return NextResponse.json(
      {
        message: "Comment submitted successfully",
        data: comment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const post = searchParams.get("post");

    if (!post) {
      return NextResponse.json(
        { message: "Post id is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({
      post,
      isvisible: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      data: comments,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}