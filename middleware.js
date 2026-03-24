import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const MAINTENANCE_MODE = true; // Set to true to enable maintenance mode, false to disable

export async function middleware(req) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  const isMaintenancePage = pathname.startsWith("/under-maintinance");

  if (MAINTENANCE_MODE) {
    if (!isMaintenancePage) {
      return NextResponse.redirect(new URL("/under-maintinance", req.url));
    }
    return NextResponse.next();
  }

  if (!MAINTENANCE_MODE && isMaintenancePage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/admin-auth");

  if (isAdminRoute && !isLoginPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
