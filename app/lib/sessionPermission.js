import { getToken } from "next-auth/jwt";
import { can, isFullAccess } from "@/app/lib/rbac";

/** The signed-in panel user behind a request ({ id, name, email, role, permissions }) or null. */
export async function getStaff(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.role) return null;
    return {
      id: token.uid || token.sub,
      name: token.name || "",
      email: token.email || "",
      role: token.role,
      permissions: token.permissions || [],
    };
  } catch (err) {
    console.error("Session read failed:", err.message);
    return null;
  }
}

/**
 * Session Checker (kept for the routes that already call it).
 * @param {Request} req
 * @param {string} target  module key (see app/lib/rbac.js), e.g. "orders", "coupons"
 * @param {boolean} isSubadmin  legacy flag: sub-admins always pass
 * @returns {Promise<boolean>} whether the caller may use the module
 *
 * Note: this used to read `token.user`, which a NextAuth JWT does not have, so it
 * always answered false. It now reads the token the way the login stores it.
 */
export default async function sessionChecker(req, target, isSubadmin) {
  const user = await getStaff(req);
  if (!user) return false;
  if (isFullAccess(user)) return true;
  return target ? can(user, target, "full") : false;
}
