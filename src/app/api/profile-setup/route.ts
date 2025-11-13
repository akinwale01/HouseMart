// app/api/profile-setup/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      email, // identify user
      username,
      profilePicture,
      bio,
      address,
      website,
      propertyCount,
      agencyName,
      licenseNumber,
      landlordType,
      userType,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Find and update user profile
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          username,
          profilePicture,
          bio,
          address,
          website,
          propertyCount,
          agencyName,
          licenseNumber,
          landlordType,
          userType,
          profileCompleted: true,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile setup completed",
      user,
    });
  } catch (error) {
    console.error("Profile setup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}