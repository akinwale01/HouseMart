import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  try {
    await connectToDatabase();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (!decoded?.id) throw new Error("Invalid token");

    const user = await User.findById(decoded.id).select("username email profilePicture role landlordType");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        landlordType: user.landlordType,
      },
    });
  } catch (error) {
    console.error("❌ Error verifying token or fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token. Please log in again." },
      { status: 401 }
    );
  }
}