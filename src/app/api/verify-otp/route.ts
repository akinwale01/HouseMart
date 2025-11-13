import { NextRequest } from "next/server";
import TempUser from "../../../../models/TempUser";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ success: false, message: "Email and OTP required" }), { status: 400 });
    }

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    if (tempUser.otp !== otp) {
      return new Response(JSON.stringify({ success: false, message: "Invalid OTP" }), { status: 400 });
    }

    if (tempUser.otpExpiry < new Date()) {
      return new Response(JSON.stringify({ success: false, message: "OTP expired" }), { status: 400 });
    }

    // ✅ Mark as verified (do NOT move to User yet)
    tempUser.isVerified = true;
    await tempUser.save();

    // ✅ Return userType so frontend can redirect properly
return new Response(
  JSON.stringify({
    success: true,
    message: "OTP verified successfully",
    email, // ✅ include the verified email in the response
  }),
  { status: 200 }
);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}