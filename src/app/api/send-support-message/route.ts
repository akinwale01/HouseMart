import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Configure your transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can also use 'smtp.office365', etc.
        auth: {
        user: process.env.EMAIL_USER2,
        pass: process.env.EMAIL_PASS2,
        },
    });

    // Send mail
    await transporter.sendMail({
      from: `"HouseMart Support" <${process.env.EMAIL_USER}>`,
      to: "jeffersonandrew19999@gmail.com", // company support email
      replyTo: email,
      subject: `New Support Message from ${name}`,
      text: message,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>New Support Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending mail:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}