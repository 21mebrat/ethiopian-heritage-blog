import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Media from "@/app/models/media";
import cloudinary from "@/app/lib/cloudinary";
import { parseToken } from "@/app/utils/auth-token";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const query: any = {};
    if (type && type !== "all") query.type = type;
    if (search) {
      query.$or = [
        { altText: { $regex: search, $options: "i" } },
        { format: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Media.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("uploadedBy", "name email"),
      Media.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch media error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("__token=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = await parseToken(token);
    if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    console.log({ decoded })
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const altText = formData.get("altText") as string || "";

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "heritage-media", resource_type: "auto" },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        )
        .end(buffer);
    });

    const newMedia = await Media.create({
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height,
      altText,
      uploadedBy: decoded.sub || decoded.userId,
    });

    return NextResponse.json({
      success: true,
      data: newMedia,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Upload failed" }, { status: 500 });
  }
}
