import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const MAINTENANCE_MODE = true;

export async function middleware(req) {
  const token = await getToken({ req, secret });

  const { pathname } = req.nextUrl;

  // 🔹 Maintenance Mode
  if (
    MAINTENANCE_MODE &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin-auth") &&
    !pathname.startsWith("/under-maintinance") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL("/under-maintinance", req.url));
  }

  // 🔹 Admin Auth Check
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};