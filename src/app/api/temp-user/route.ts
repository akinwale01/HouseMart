import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import TempUser from "../../../../models/TempUser";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const tempUser = await TempUser.findOne({ email }).lean();

    if (!tempUser) {
      return NextResponse.json({ success: false, message: "No temporary user found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tempUser });
  } catch (error) {
    console.error("❌ Temp-user fetch error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}