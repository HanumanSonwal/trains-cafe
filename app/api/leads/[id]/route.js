import { NextResponse } from "next/server";
import Lead from "@/app/models/lead";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const lead = await Lead.findById(params.id);
    return NextResponse.json({ success: true, data: lead });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const updates = await req.json();

    const updatedLead = await Lead.findByIdAndUpdate(params.id, updates, {
      new: true,
    });

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    await Lead.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Lead Deleted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
