import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { extractTokenFromRequest, verifyToken } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Both current and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: "New password must be at least 8 characters" }, { status: 400 });
    }

    const user = await User.findById(decoded.sub).select("+password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
