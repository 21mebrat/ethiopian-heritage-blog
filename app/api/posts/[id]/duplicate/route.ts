import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import mongoose from "mongoose";

export async function POST(
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

    const originalPost = await Post.findById(id);

    if (!originalPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Create a unique slug for the duplicate
    let newSlug = `${originalPost.slug}-copy`;
    let counter = 1;

    while (await Post.findOne({ slug: newSlug })) {
      newSlug = `${originalPost.slug}-copy-${counter}`;
      counter++;
    }

    const duplicatedPost = await Post.create({
      title: `${originalPost.title} (Copy)`,
      slug: newSlug,
      content: originalPost.content,
      excerpt: originalPost.excerpt,
      coverImage: originalPost.coverImage,
      media: originalPost.media,
      author: originalPost.author,
      category: originalPost.category,
      tags: originalPost.tags,
      status: "draft",
      views: 0,
      publishedAt: null,
    });

    return NextResponse.json({
      success: true,
      message: "Post duplicated successfully",
      data: duplicatedPost,
    });
  } catch (err: any) {
    console.error("DUPLICATE_POST_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
