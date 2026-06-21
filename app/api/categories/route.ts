import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Category from "@/app/models/category";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const name = body.name?.trim();
    const description = body.description?.trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const existing = await Category.findOne({ slug });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description: description || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CATEGORY_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        await connectDB();
        
        const categories = await Category.find().sort({ createdAt: -1 });
        
        return NextResponse.json(
          {
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
          },
          { status: 200 }
        );

    } catch (error) {
       return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
        },
        { status: 500 }
      ); 
    }
}