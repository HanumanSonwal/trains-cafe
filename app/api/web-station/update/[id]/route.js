import dbConnect from "@/app/lib/dbConnect";
import WebStation from "@/app/models/webStation";
import StationModel from "@/app/models/station";
import { createStationSlug } from "@/utils/slugify";

const { NextResponse } = require("next/server");

export async function PUT(req, context) {
  try {
    await dbConnect();

    const { id } = context.params;

    const { name, title, description, keywords, pageData, status, Station } =
      await req.json();

    const stationData = await StationModel.findById(Station);
    if (!stationData) {
      return NextResponse.json(
        { message: "Invalid station ID" },
        { status: 400 }
      );
    }

    const slug = createStationSlug(stationData.name, stationData.code);

    const webStation = await WebStation.findById(id);
    if (!webStation) {
      return NextResponse.json(
        { message: "Web station not found" },
        { status: 404 }
      );
    }

    webStation.name = name;
    webStation.title = title;
    webStation.slug = slug;
    webStation.description = description;
    webStation.keywords = keywords;
    webStation.pageData = pageData;
    webStation.status = status;
    webStation.Station = Station;

    await webStation.save();

    return NextResponse.json({
      message: "Web station updated successfully",
      data: { webStation },
    });
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
