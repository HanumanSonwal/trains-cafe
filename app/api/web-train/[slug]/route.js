import { NextResponse } from "next/server";
import WebTrain from "@/app/models/webtrain";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req, context) {
  try {
    const { slug } = context.params;

    const trainnumber = slug;

    if (!trainnumber || isNaN(trainnumber)) {
      return NextResponse.json(
        {
          message: "Invalid or missing train number",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const query = { status: "published", trainnumber: trainnumber };

    const result = await WebTrain.findOne(query);

    if (!result) {
      return NextResponse.json(
        {
          message: "Web station not found",
        },
        { status: 404 }
      );
    }

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
