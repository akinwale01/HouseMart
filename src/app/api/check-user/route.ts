import { NextResponse } from "next/server";
import {connectToDatabase} from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req:Request) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    return NextResponse.json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}