import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./modules/auth/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await verifyToken(token);
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};