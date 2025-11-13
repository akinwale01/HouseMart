import { NextRequest } from "next/server";
import TempUser from "../../../../models/TempUser";
import User from "../../../../models/User";
import { connectToDatabase } from "../../../../lib/mongodb";
import nodemailer from "nodemailer";

interface TempUserPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  password: string;
  userType: "customer" | "agent";
  landlordType?: "individual" | "agency";
  agencyName?: string;
  licenseNumber?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body: Partial<TempUserPayload> & { purpose?: string } = await req.json();
    const { email, purpose } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // ✅ FORGOT PASSWORD: check email exists in main User collection
    if (purpose === "forgot-password") {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return new Response(
          JSON.stringify({ success: false, message: "User not found" }),
          { status: 404 }
        );
      }
    }

    // ✅ Generate OTP
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // ✅ Store OTP in TempUser
    const existing = await TempUser.findOne({ email });
    if (existing) {
      existing.set({ otp, otpExpires });
      await existing.save();
    } else {
      await TempUser.create({ email, otp, otpExpires });
    }

    // ✅ Configure and send email
    console.log("📧 Sending OTP to:", email);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"🏠 HouseMart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #0070f3; letter-spacing: 2px;">${otp}</h1>
          <p>This code expires in <b>10 minutes</b>.</p>
          ${
            purpose === "forgot-password"
              ? "<p>If you didn’t request a password reset, ignore this email.</p>"
              : ""
          }
        </div>
      `,
    });

    console.log("✅ OTP email sent successfully:", info.messageId);

    return new Response(JSON.stringify({ success: true, message: "OTP sent" }), { status: 200 });
  } catch (err) {
    console.error("❌ OTP sending error:", err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}