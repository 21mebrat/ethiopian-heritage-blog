import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { generateToken } from "@/app/lib/auth";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // BODY
    const body = await req.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    // VALIDATION
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // FIND USER
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // CHECK PASSWORD
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // CREATE JWT TOKEN
    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // RESPONSE
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: "__token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to login",
      },
      { status: 500 }
    );
  }
}