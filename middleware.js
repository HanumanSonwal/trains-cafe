// import { NextResponse } from "next/server";

// const MAINTENANCE_MODE = false;

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   const isMaintenancePage = pathname.startsWith("/under-maintinance");

//   // 🟥 Maintenance ON → sabko maintenance page pe bhej
//   if (MAINTENANCE_MODE) {
//     if (!isMaintenancePage) {
//       return NextResponse.redirect(new URL("/under-maintinance", req.url));
//     }
//   }

//   // 🟩 Maintenance OFF → maintenance page open nahi hona chahiye
//   if (!MAINTENANCE_MODE) {
//     if (isMaintenancePage) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
// };

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
