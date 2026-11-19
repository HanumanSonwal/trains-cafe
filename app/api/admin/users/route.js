import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { getStaff } from "@/app/lib/sessionPermission";
import { isAdmin } from "@/app/lib/rbac";
import { cleanPermissions } from "@/app/lib/userInput";

// Admin only (the middleware checks it, and every handler checks it again).
const deny = () => NextResponse.json({ success: false, message: "Only an admin can manage users" }, { status: 403 });

const PANEL_ROLES = ["admin", "sub-admin", "staff"];

/** GET /api/admin/users?search=&page=&limit=  ->  panel users (never the password) */
export async function GET(req) {
  if (!isAdmin(await getStaff(req))) return deny();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit"), 10) || 20));
  const search = (searchParams.get("search") || "").trim().slice(0, 60);

  await dbConnect();
  const filter = { role: { $in: PANEL_ROLES } };
  if (search) {
    const rx = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [{ name: { $regex: rx, $options: "i" } }, { email: { $regex: rx, $options: "i" } }];
  }

  const [data, total] = await Promise.all([
    User.find(filter).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
  return NextResponse.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
}

/** POST /api/admin/users  { name, email, password, role, permissions } */
export async function POST(req) {
  const caller = await getStaff(req);
  if (!isAdmin(caller)) return deny();

  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = PANEL_ROLES.includes(body.role) ? body.role : "staff";

  if (!name) return NextResponse.json({ success: false, message: "Name is required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ success: false, message: "Enter a valid email" });
  if (password.length < 8) return NextResponse.json({ success: false, message: "Password must be at least 8 characters" });

  const permissions = role === "staff" ? cleanPermissions(body.permissions) : [];
  if (role === "staff" && permissions.length === 0) {
    return NextResponse.json({ success: false, message: "Give this user access to at least one module" });
  }

  await dbConnect();
  if (await User.exists({ email })) return NextResponse.json({ success: false, message: "A user with this email already exists" });

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    permissions,
    active: true,
    createdBy: caller.email,
  });
  return NextResponse.json({ success: true, message: "User created", id: String(user._id) });
}
