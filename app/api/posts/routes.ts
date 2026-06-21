import { getAuthUser } from "@/app/lib/auth";
import cloudinary from "@/app/lib/cloudinary";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import { NextRequest, NextResponse } from "next/server";

// simple slug generator
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// helper: upload to cloudinary
const uploadToCloudinary = async (file: File, folder: string) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // AUTH CHECK
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // IMPORTANT: formData (NOT JSON because we handle files)
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : [];

    const status = (formData.get("status") as string) || "draft";

    const coverFile = formData.get("coverImage") as File | null;
    const mediaFiles = formData.getAll("media") as File[];

    // VALIDATION
    if (!title || !content || !category) {
      return NextResponse.json(
        { message: "Title, content, category are required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const existing = await Post.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { message: "Post already exists" },
        { status: 409 }
      );
    }

    // -------------------------
    // UPLOAD COVER IMAGE
    // -------------------------
    let coverImage = null;

    if (coverFile) {
      const uploaded = await uploadToCloudinary(
        coverFile,
        "ethiopian-heritage/posts/cover"
      );

      coverImage = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    // -------------------------
    // UPLOAD MEDIA ARRAY
    // -------------------------
    let media: any[] = [];

    if (mediaFiles && mediaFiles.length > 0) {
      media = await Promise.all(
        mediaFiles.map(async (file) => {
          const uploaded = await uploadToCloudinary(
            file,
            "ethiopian-heritage/posts/media"
          );

          return {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
            type: file.type.startsWith("video") ? "video" : "image",
          };
        })
      );
    }

    // -------------------------
    // CREATE POST
    // -------------------------
    const post = await Post.create({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImage,
      media,
      author: session.sub,
      category,
      tags,
      status,
      publishedAt: status === "published" ? new Date() : null,
    });

    return NextResponse.json(
      {
        message: "Post created successfully",
        data: post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // draft | published
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    // search (title + tags)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const posts = await Post.find(filter)
      .populate({
        path: "author",
        select: "name avatar",
      })
      .populate({
        path: "category",
        select: "name slug",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
if(posts.length === 0) {
  return NextResponse.json({
    data: [],
    pagination: {
      total: 0,
      page,
      limit,
      totalPages: 0,
    },
  });
} 
    const total = await Post.countDocuments(filter);

    return NextResponse.json({
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}