import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

interface IUser {
  username: string;
  email: string;
  profilePicture?: string | null;
  userType: string;
  landlordType?: string | null;
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userType = searchParams.get("userType");
    const landlordType = searchParams.get("landlordType");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Missing email" },
        { status: 400 }
      );
    }

    // Fetch user by email first
    let userDoc = await User.findOne({ email }).lean<IUser>();

    // Optionally auto-create user (for Google or new users)
    if (!userDoc) {
      const newUser = await User.create({
        email,
        username: email.split("@")[0],
        userType: userType || "customer", // default role
        landlordType: landlordType || null,
        profilePicture: null,
      });

      userDoc = newUser.toObject();
    }

    // TypeScript-safe: still check if userDoc exists
    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "User creation failed" },
        { status: 500 }
      );
    }

    // Check userType if provided
    if (userType && userDoc.userType !== userType) {
      return NextResponse.json(
        { success: false, message: "User type mismatch" },
        { status: 404 }
      );
    }

    // Check landlordType if provided
    if (landlordType && userDoc.landlordType !== landlordType) {
      return NextResponse.json(
        { success: false, message: "Landlord type mismatch" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: userDoc.username,
        email: userDoc.email,
        profilePicture: userDoc.profilePicture || null,
        userType: userDoc.userType,
        landlordType: userDoc.landlordType || null,
      },
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}