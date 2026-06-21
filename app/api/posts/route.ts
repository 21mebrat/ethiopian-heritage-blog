import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import mongoose from "mongoose";
import { POST_POPULATION } from "@/app/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const { title, slug, content, authorId, categoryId, status, tags, coverImage } = body;

    if (!title || !slug || !content || !authorId || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (title, slug, content, authorId, categoryId)" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await Post.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    const newPost = await Post.create({
      title,
      slug,
      content,
      author: new mongoose.Types.ObjectId(authorId),
      category: new mongoose.Types.ObjectId(categoryId),
      status: status || "draft",
      tags: tags || [],
      coverImage: coverImage || null,
      publishedAt: status === "published" ? new Date() : null,
    });

    return NextResponse.json(
      { success: true, message: "Post created successfully", data: newPost },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("CREATE_POST_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate(POST_POPULATION.category)
      .populate(POST_POPULATION.author)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: posts },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET_POSTS_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
