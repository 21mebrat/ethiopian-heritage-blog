import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { extractTokenFromRequest, verifyToken } from "@/app/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = extractTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.sub).select(
      "-password"
    );

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "User not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}
