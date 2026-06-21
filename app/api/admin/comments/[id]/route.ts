import { connectDB } from "@/app/lib/db";
import Comment from "@/app/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const comment = await Comment.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: "after", runValidators: true }
    );

    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error: any) {
    console.error("ADMIN_COMMENT_PATCH_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    console.error("ADMIN_COMMENT_DELETE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
