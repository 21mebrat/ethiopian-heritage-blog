import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import PreviewDraft from "@/app/models/preview-draft";
import Category from "@/app/models/category";
import { createPreviewCredentials } from "@/app/lib/preview-draft";
import mongoose from "mongoose";

const MAX_CONTENT_BYTES = 512_000; // ~500KB JSON payload guard

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, coverImage, tags, categoryId, authorName } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content is required for preview" },
        { status: 400 }
      );
    }

    const serialized = JSON.stringify(content);
    if (serialized.length > MAX_CONTENT_BYTES) {
      return NextResponse.json(
        { success: false, message: "Preview content is too large" },
        { status: 413 }
      );
    }

    await connectDB();

    let categoryName: string | null = null;
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      const category = await Category.findById(categoryId).select("name").lean();
      categoryName = category?.name ?? null;
    }

    const { previewId, previewSecret, expiresAt } = createPreviewCredentials();

    await PreviewDraft.create({
      previewId,
      previewSecret,
      title: (title ?? "").trim() || "Untitled",
      content,
      coverImage: coverImage ?? null,
      tags: Array.isArray(tags) ? tags : [],
      categoryName,
      authorName: authorName ?? null,
      expiresAt,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          previewId,
          previewSecret,
          expiresAt,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("CREATE_PREVIEW_DRAFT_ERROR:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
