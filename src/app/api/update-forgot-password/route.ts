import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing email or password. Did you verify your email?" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err: unknown) {
    console.error("Forgot password update error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}