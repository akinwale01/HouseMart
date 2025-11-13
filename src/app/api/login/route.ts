import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password, userType, landlordType } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Check if user is logging into the correct portal
    if (user.userType !== userType) {
      const correctPortal =
        user.userType === "agent"
          ? "Agent"
          : user.userType === "customer"
          ? "Customer"
          : "Landlord";

      return NextResponse.json(
        {
          success: false,
          message: `You’re trying to log in through the wrong portal. Please use the ${correctPortal} login page.`,
        },
        { status: 403 }
      );
    }

    // ✅ For agents, ensure landlordType matches (individual vs agency)
    if (user.userType === "agent" && user.landlordType !== landlordType) {
      return NextResponse.json(
        {
          success: false,
          message: `Incorrect login type. This account is registered as a ${user.landlordType} agent.`,
        },
        { status: 403 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        userType: user.userType,
        landlordType: user.landlordType,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // ✅ Determine redirect route
    let redirectUrl = "/dashboard/customer";
    if (user.userType === "agent") {
      if (user.landlordType === "agency") {
        redirectUrl = "/dashboard/agent";
      } else if (user.landlordType === "individual") {
        redirectUrl = "/dashboard/landlord";
      }
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      userType: user.userType,
      landlordType: user.landlordType,
      redirectUrl,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}