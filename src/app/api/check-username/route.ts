import { NextResponse } from "next/server";
import {connectToDatabase} from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    const available = !existingUser;

    let suggestions: string[] = [];
    if (!available) {
      suggestions = [
        `${username}_${Math.floor(Math.random() * 100)}`,
        `${username}${Math.floor(Math.random() * 999)}`,
        `${username}_official`,
      ];
    }

    return NextResponse.json({ available, suggestions });
  } catch (error) {
    console.error("Username check failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}