import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: ["/dashboard/:path*"], // protect all dashboard routes
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const SECRET_KEY = process.env.JWT_SECRET;
    if (!SECRET_KEY) throw new Error("JWT_SECRET is not defined in .env");

    const decoded = jwt.verify(token, SECRET_KEY) as { email: string; role: "customer" | "landlord" | "agent" };

    // Redirect based on role and requested path
    const url = req.nextUrl.clone();

    if (decoded.role === "customer" && url.pathname.startsWith("/dashboard/landlord")) {
      return NextResponse.redirect(new URL("/dashboard/customer", req.url));
    }

    if ((decoded.role === "landlord" || decoded.role === "agent") && url.pathname.startsWith("/dashboard/customer")) {
      return NextResponse.redirect(new URL("/dashboard/landlord", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}