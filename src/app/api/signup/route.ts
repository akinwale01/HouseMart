import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import TempUser from "../../../../models/TempUser";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      userType,
      landlordType,
      agencyName,
      licenseNumber,
      startOver,
      google = false,
      picture,
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!google && !password && !startOver) {
      return NextResponse.json(
        { success: false, message: "Password is required for manual signup" },
        { status: 400 }
      );
    }

    // ✅ 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "User already exists. Please log in instead.",
      });
    }

    // ✅ 2️⃣ Check if there's an existing temp user
    let existingTemp = await TempUser.findOne({ email });

    if (existingTemp) {
      if (startOver) {
        await TempUser.deleteOne({ email });
        existingTemp = null;
      } else if (!existingTemp.profileCompleted) {
        return NextResponse.json({
          success: true,
          incomplete: true,
          message: "Temp user exists, profile not completed.",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "User already exists. Please log in instead.",
        });
      }
    }

    // ✅ 3️⃣ Hash password if not Google signup
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // ✅ 4️⃣ Generate OTP only if manual signup
    const otp = !google ? Math.floor(10000 + Math.random() * 90000) : undefined;
    const otpExpiry = !google ? new Date(Date.now() + 10 * 60 * 1000) : undefined;

    // ✅ 5️⃣ Create temp user record
    const tempUser = new TempUser({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      userType,
      landlordType,
      agencyName,
      licenseNumber,
      picture: google ? picture : undefined,
      otp,
      otpExpiry,
      isVerified: google ? true : false,
      profileCompleted: false,
      google,
    });

    await tempUser.save();

    // ✅ 6️⃣ Send OTP if manual signup
    if (!google && otp) {
      // Dynamically determine base URL (works on localhost + production)
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXTAUTH_URL ||
            process.env.RENDER_EXTERNAL_URL ||
            "http://localhost:3000");

      const response = await fetch(`${baseUrl}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        console.error("❌ Failed to send OTP:", await response.text());
        return NextResponse.json(
          { success: false, message: "Failed to send OTP" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: google
        ? "Google signup successful. Proceed to profile setup."
        : "OTP sent successfully. Please check your email.",
    });
  } catch (err: unknown) {
    console.error("Signup Error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}