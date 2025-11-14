import nodemailer from "nodemailer";
import TempUser from "../models/TempUser";
import { connectToDatabase } from "./mongodb";

export async function sendOtpEmail(email: string, purpose?: string) {
  await connectToDatabase();

  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const existing = await TempUser.findOne({ email });
  if (existing) {
    existing.set({ otp, otpExpires });
    await existing.save();
  } else {
    await TempUser.create({ email, otp, otpExpires });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from: `"🏠 HouseMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your OTP Code</h2>
        <h1 style="color: #0070f3;">${otp}</h1>
        <p>Expires in 1 minutes.</p>
        ${purpose === "forgot-password" ? "<p>If you didn’t request this, ignore.</p>" : ""}
      </div>
    `,
  });

  console.log(`✅ OTP sent to ${email} successfully`);
  return otp;
}