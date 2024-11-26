import { getToken } from "next-auth/jwt";

/**
 * Session Checker
 * @param {Object} req - HTTP request object
 * @param {string} target - Target API or resource
 * @returns {boolean} - Whether the session is authorized
 */
export default async function sessionChecker(req, target, isSubadmin) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const session = await getToken({ req, secret });

    // No session: Unauthorized
    if (!session) {
      return false;
    }

    const user = session.user;

    // Admin: Full access
    if (user.role === "admin") {
      return true;
    }

    if (user.role === "sub-admin" && isSubadmin) {
      return true;
    }

    // Staff-Admin: Check permissions
    if (user.role != "sub-admin") {
      if (!target) {
        return false; // Target API not specified
      }

      const permissions = user.permissions || [];
      const targetPermission = permissions.find((perm) => perm.name === target);

      if (!targetPermission) {
        return false; // No permissions found for the target
      }

      const { view, edit, delete: _delete } = targetPermission;
      return view || edit || _delete; // Allow if any action is permitted
    }

    // Other roles: Unauthorized
    return false;
  } catch (err) {
    console.error("Session Checker Error:", err);
    return false;
  }
}
