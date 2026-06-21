import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import PreviewDraft from "@/app/models/preview-draft";
import { estimateReadingTime } from "@/app/lib/reading-time";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.nextUrl.searchParams.get("t");

    if (!id || !token) {
      return NextResponse.json(
        { success: false, message: "Invalid preview link" },
        { status: 400 }
      );
    }

    await connectDB();

    const draft = await PreviewDraft.findOne({
      previewId: id,
      previewSecret: token,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!draft) {
      return NextResponse.json(
        { success: false, message: "Preview not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        title: draft.title,
        content: draft.content,
        coverImage: draft.coverImage,
        tags: draft.tags,
        category: draft.categoryName ? { name: draft.categoryName } : null,
        author: draft.authorName ? { name: draft.authorName } : null,
        readingTime: estimateReadingTime(draft.content),
        publishedAt: null,
        isPreview: true,
      },
    });
  } catch (err: unknown) {
    console.error("GET_PREVIEW_DRAFT_ERROR:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
