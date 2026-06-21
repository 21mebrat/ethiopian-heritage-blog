import cloudinary from "@/app/lib/cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { extractTokenFromRequest, verifyToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "user-avatars", resource_type: "image" },
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
    });
  } catch (e: any) {
    console.error("AVATAR_UPLOAD_ERROR:", e);
    return NextResponse.json(
      { success: false, message: e.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
