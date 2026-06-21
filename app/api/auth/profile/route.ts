import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { extractTokenFromRequest, verifyToken } from "@/app/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, bio, avatar } = body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: decoded.sub } });
      if (existingUser) {
        return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.sub,
      { $set: { name, email, bio, avatar } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
