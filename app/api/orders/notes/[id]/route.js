import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getStaff } from "@/app/lib/sessionPermission";

// POST /api/orders/notes/:id  { text }  -> adds an internal note (who + when are saved with it)
export async function POST(req, { params }) {
  try {
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid order" }, { status: 400 });
    }
    const { text } = await req.json().catch(() => ({}));
    const note = String(text || "").trim().slice(0, 500);
    if (!note) return NextResponse.json({ success: false, message: "Write a note first" }, { status: 400 });

    await dbConnect();
    const staff = await getStaff(req);
    const entry = { kind: "note", text: note, by: staff?.name || staff?.email || "", at: new Date() };

    const res = await Order.updateOne({ _id: id }, { $push: { notes: entry } });
    if (!res.matchedCount) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

    const fresh = await Order.findById(id).select("notes").lean();
    return NextResponse.json({ success: true, notes: fresh?.notes || [] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Could not save the note" }, { status: 500 });
  }
}
