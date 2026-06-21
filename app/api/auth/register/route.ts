import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { generateToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // connect database
    await connectDB();

    // parse body
    const body = await req.json();

    const {
      name,
      email,
      password,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });


    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

        token,
      },
      { status: 201 }
    );

    // optional secure cookie
    response.cookies.set({
      name: "__token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {

    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}