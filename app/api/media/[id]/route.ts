import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Media from "@/app/models/media";
import cloudinary from "@/app/lib/cloudinary";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ message: "Media not found" }, { status: 404 });
    }

    await cloudinary.uploader.destroy(media.publicId, {
       resource_type: media.type === "video" ? "video" : "image"
    });

    await Media.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete media error:", error);
    return NextResponse.json({ message: error.message || "Delete failed" }, { status: 500 });
  }
}
