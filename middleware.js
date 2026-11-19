import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { homePath, isPanelUser, can, isAdmin, moduleForPage, passesRule, ruleForApi } from "@/app/lib/rbac";

const secret = process.env.NEXTAUTH_SECRET;
const MAINTENANCE_MODE = false;

const json = (message, status) => NextResponse.json({ success: false, message }, { status });

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 🔹 Maintenance Mode
  if (
    MAINTENANCE_MODE &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin-auth") &&
    !pathname.startsWith("/super-panel") &&
    !pathname.startsWith("/under-maintinance") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL("/under-maintinance", req.url));
  }

  // 🔹 API guard: panel-only endpoints need a signed-in user with access to that module.
  // Public endpoints (menu, vendors lookup, place-order, ...) are not in the rule table.
  if (pathname.startsWith("/api/")) {
    const rule = ruleForApi(pathname, req.method);
    if (!rule) return NextResponse.next();

    const token = await getToken({ req, secret });
    if (!token) return json("Please sign in", 401);
    const user = { role: token.role, permissions: token.permissions || [] };
    if (!passesRule(user, rule)) return json("You do not have access to this", 403);
    return NextResponse.next();
  }

  // 🔹 Panel pages (/admin/..., /super-panel/...)
  const page = moduleForPage(pathname);
  if (page) {
    const token = await getToken({ req, secret });
    const login = page.panel === "super-panel" ? "/super-panel-auth" : "/admin-auth";

    const user = token ? { role: token.role, permissions: token.permissions || [] } : null;
    if (!user || !isPanelUser(user)) return NextResponse.redirect(new URL(login, req.url));

    // the Users & Roles page (and anything unknown under "users") is for the admin role only
    if (page.module === "users") {
      if (!isAdmin(user)) {
        return NextResponse.redirect(new URL(homePath(user, page.panel) || login, req.url));
      }
    } else if (page.module && !can(user, page.module, "view")) {
      // staff opened a module they were not given: send them to their first allowed page
      const home = homePath(user, page.panel);
      return NextResponse.redirect(new URL(home || login, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/super-panel/:path*", "/api/:path*"],
};
