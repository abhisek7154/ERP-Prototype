import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./modules/auth/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  console.log("Path:", request.nextUrl.pathname);
  console.log("Token exists:", !!token);

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      console.log("No auth-token cookie");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = await verifyToken(token);
      console.log("JWT payload:", payload);
    } catch (error) {
      console.log("JWT verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};