import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "../../../../lib/sendOtp";

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    await sendOtpEmail(email, purpose);

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("❌ OTP sending error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}