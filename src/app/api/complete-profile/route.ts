import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import TempUser from "../../../../models/TempUser";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, username, bio, address, profilePicture } = (await req.json()) as {
      email: string;
      username: string;
      bio?: string;
      address?: string;
      profilePicture?: string;
    };

    if (!email || !username)
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser)
      return NextResponse.json({ success: false, message: "Temp user not found" }, { status: 404 });

    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername)
      return NextResponse.json({ success: false, message: "Username already taken" }, { status: 400 });

    const newUser = new User({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      email: tempUser.email,
      phone: tempUser.phone,
      password: tempUser.password,
      userType: tempUser.userType,
      landlordType: tempUser.landlordType,
      agencyName: tempUser.agencyName,
      licenseNumber: tempUser.licenseNumber,
      username: username.toLowerCase(),
      bio,
      address,
      profilePicture,
      isEmailVerified: true,
      profileCompleted: true,
    });

    await newUser.save();
    await TempUser.deleteOne({ email });

    // ✅ Create JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        userType: newUser.userType,
        landlordType: newUser.landlordType,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // ✅ Determine redirect route
    let redirectUrl = "/dashboard/customer";
    if (newUser.userType === "agent") {
      redirectUrl = newUser.landlordType === "agency" ? "/dashboard/agent" : "/dashboard/landlord";
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      token,
      redirectUrl,
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    return NextResponse.json({ success: false, message: "Server error completing profile" }, { status: 500 });
  }
}