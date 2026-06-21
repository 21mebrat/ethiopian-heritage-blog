import "server-only";
import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make sure we infer the resource_type as 'auto' for robust image/video support
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "editor-uploads", resource_type: "auto" },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type, // 'image' or 'video'
    });
  } catch (e: any) {
    console.error("UPLOAD_ERROR:", e);
    return NextResponse.json(
      { message: e.message || "Failed to upload file to Cloudinary" },
      { status: 500 }
    );
  }
}