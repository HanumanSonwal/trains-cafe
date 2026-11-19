import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { getStaff } from "@/app/lib/sessionPermission";
import { isAdmin } from "@/app/lib/rbac";
import { cleanPermissions } from "@/app/lib/userInput";

const deny = () => NextResponse.json({ success: false, message: "Only an admin can manage users" }, { status: 403 });
const PANEL_ROLES = ["admin", "sub-admin", "staff"];

/** PUT /api/admin/users/:id  { name?, role?, permissions?, active?, password? } */
export async function PUT(req, { params }) {
  const caller = await getStaff(req);
  if (!isAdmin(caller)) return deny();
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ success: false, message: "Invalid user" });

  const body = await req.json().catch(() => ({}));
  await dbConnect();
  const user = await User.findById(params.id);
  if (!user || !PANEL_ROLES.includes(user.role)) return NextResponse.json({ success: false, message: "User not found" });

  const isSelf = String(user._id) === String(caller.id);
  const update = {};

  if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();
  if (PANEL_ROLES.includes(body.role)) {
    // an admin cannot demote or lock out themselves
    if (isSelf && body.role !== "admin") return NextResponse.json({ success: false, message: "You cannot change your own role" });
    update.role = body.role;
  }
  const role = update.role || user.role;
  if (role === "staff" && Array.isArray(body.permissions)) {
    const permissions = cleanPermissions(body.permissions);
    if (permissions.length === 0) return NextResponse.json({ success: false, message: "Give this user access to at least one module" });
    update.permissions = permissions;
  }
  if (role !== "staff") update.permissions = [];
  if (typeof body.active === "boolean") {
    if (isSelf && !body.active) return NextResponse.json({ success: false, message: "You cannot switch off your own account" });
    update.active = body.active;
  }
  if (body.password) {
    if (String(body.password).length < 8) return NextResponse.json({ success: false, message: "Password must be at least 8 characters" });
    update.password = await bcrypt.hash(String(body.password), 10);
  }

  await User.updateOne({ _id: user._id }, { $set: update });
  return NextResponse.json({ success: true, message: "User updated" });
}

/** DELETE /api/admin/users/:id */
export async function DELETE(req, { params }) {
  const caller = await getStaff(req);
  if (!isAdmin(caller)) return deny();
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ success: false, message: "Invalid user" });
  if (String(params.id) === String(caller.id)) return NextResponse.json({ success: false, message: "You cannot delete your own account" });

  await dbConnect();
  const res = await User.deleteOne({ _id: params.id, role: { $in: PANEL_ROLES } });
  return NextResponse.json(res.deletedCount ? { success: true, message: "User deleted" } : { success: false, message: "User not found" });
}
