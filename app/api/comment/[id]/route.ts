import { connectDB } from "@/app/lib/db";
import Comment from "@/app/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const comment = await Comment.findById(params.id).lean();

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: comment,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const comment = await Comment.findById(params.id);

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    await comment.deleteOne();

    return NextResponse.json({
      message: "Comment deleted successfully",
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();

    const comment = await Comment.findById(params.id);

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // update allowed fields only
    if (body.content !== undefined) {
      comment.content = body.content;
    }

    if (body.isvisible !== undefined) {
      comment.isvisible = body.isvisible;
    }

    await comment.save();

    return NextResponse.json({
      message: "Comment updated successfully",
      data: comment,
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