import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "../../../../lib/mongodb";
import Subscriber from "../../../../models/Subscriber";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: "Already subscribed" }, { status: 400 });
    }

    // Save subscriber
    await Subscriber.create({ email });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
  from: `"HouseMart" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Welcome to HouseMart!",
  html: `
    <div style="font-family:Arial,sans-serif; line-height:1.6; color:#333;">
      <p>🎉 Thanks for subscribing to <b>HouseMart</b>!</p>
      <p>Expect exciting design stories soon.</p>
      <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />
      <p style="font-size:12px; color:#777;">
        If you no longer wish to receive updates, you can
<a href="https://shop-right-nu.vercel.app//api/unsubscribe?email=${email}"
           target="_blank"
           style="color:#f97316; text-decoration:none;">
          unsubscribe here
        </a>.
      </p>
    </div>
  `,
});

    return NextResponse.json({ success: true, message: "Subscription successful!" });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}