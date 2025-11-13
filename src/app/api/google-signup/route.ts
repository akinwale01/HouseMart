import { NextRequest, NextResponse } from "next/server";
import {connectToDatabase} from "../../../../lib/mongodb"; // your MongoDB connection helper
import TempUser from "../../../../models/TempUser";
import User from "../../../../models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();
   try {
    const body = await req.json();
    const { email, firstName, lastName, googleId, userType } = body;

    if (!email || !googleId || !userType) {
      return NextResponse.json({
        success: false,
        message: "Email, Google ID, and userType are required.",
      }, { status: 400 });
    }

    // Check if user exists in main User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: true, message: "User already exists", userExists: true });
    }

    // Check if user exists in TempUser
    let tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      if (tempUser.profileCompleted) {
        // Migrate immediately if profile is somehow completed
        const newUser = new User({
          email: tempUser.email,
          firstName: tempUser.firstName,
          lastName: tempUser.lastName,
          phone: tempUser.phone,
          password: tempUser.password || "",
          userType: tempUser.userType,
          landlordType: tempUser.landlordType,
          agencyName: tempUser.agencyName,
          licenseNumber: tempUser.licenseNumber,
          profilePicture: tempUser.profilePicture || "",
        });
        await newUser.save();
        await tempUser.deleteOne();
        return NextResponse.json({ success: true, message: "Profile completed and user created", userExists: true });
      }
      return NextResponse.json({ success: true, tempUserId: tempUser._id, profileCompleted: false });
    }

    // Create new TempUser
    tempUser = new TempUser({
      firstName,
      lastName,
      email,
      googleId,
      userType,
      profileCompleted: false,
    });
    await tempUser.save();

    return NextResponse.json({ success: true, tempUserId: tempUser._id, profileCompleted: false });
  } catch (err) {
    console.error("Google signup error:", err);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}