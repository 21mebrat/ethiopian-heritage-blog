import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Category from "@/app/models/category";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("CATEGORY_UPDATE_ERROR:", error);
    return NextResponse.json({ success: false, message: error.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("CATEGORY_DELETE_ERROR:", error);
    return NextResponse.json({ success: false, message: error.message || "Delete failed" }, { status: 500 });
  }
}
