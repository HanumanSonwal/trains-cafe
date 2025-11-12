import { NextResponse } from "next/server";
import Lead from "@/app/models/lead";
import dbConnect from "@/app/lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    const lead = await Lead.create({
      name: data.name || "",
      mobile: data.mobile || "",
      email: data.email || "",
      station: data.station || "",
      train_number: data.train_number || "",
      pnr: data.pnr || "",
      cartItems: data.cartItems || [],
      source: data.source || "checkout",
      status: "new",
    });

    return NextResponse.json({
      success: true,
      leadId: lead._id,
      data: lead,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const {
      search,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = Object.fromEntries(new URL(req.url).searchParams);

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const skip = (page - 1) * limit;

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { leadId, status } = await req.json();

    const updated = await Lead.findByIdAndUpdate(
      leadId,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
