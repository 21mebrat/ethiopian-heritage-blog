import { connectDB } from "@/app/lib/db";
import Settings from "@/app/models/settings";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    let settings = await Settings.findOne();
    
    if (settings) {
      settings = await Settings.findByIdAndUpdate(settings._id, body, { new: true });
    } else {
      settings = await Settings.create(body);
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
