const { NextResponse } = require("next/server");
import dbConnect from "@/app/lib/dbConnect";
import WebStation from "@/app/models/webStation";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const search = searchParams.get("search") || searchParams.get("slug") || "";

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    let query = {};

    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.Station = new mongoose.Types.ObjectId(search);
      } else {
        query.$or = [
          { slug: { $regex: `^${search}$`, $options: "i" } }, 
        ];
      }
    }

    const result = await WebStation.paginate(query, options);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

