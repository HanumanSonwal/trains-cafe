import dbConnect from "@/app/lib/dbConnect";
import WebStation from "@/app/models/webStation";
import StationModel from "@/app/models/station";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const page = parseInt(url.searchParams.get("page"), 10) || 1;
    const limit = parseInt(url.searchParams.get("limit"), 10) || 10;

    await dbConnect();

    const searchCriteria = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { code: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await StationModel.countDocuments(searchCriteria);

    const skip = (page - 1) * limit;
    const query = StationModel.find(searchCriteria).sort({ name: 1 });

    if (limit > 0) {
      query.skip(skip).limit(limit);
    }

    const stations = await query;

    const stationIds = stations.map((station) => station._id);
    const webStations = await WebStation.find(
      { Station: { $in: stationIds } },
      "Station slug"
    );

    const slugMap = {};
    webStations.forEach((ws) => {
      slugMap[ws.Station.toString()] = ws.slug;
    });

    const stationsWithSlugs = stations.map((station) => ({
      ...station.toObject(),
      slug: slugMap[station._id.toString()] || null,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: stationsWithSlugs,
        total,
        page,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stations:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching stations" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.name || !body.code || !body.location || !body.address) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All required fields must be filled",
        }),
        { status: 400 }
      );
    }
    await dbConnect();
    const newStation = new StationModel(body);
    await newStation.save();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Station added successfully",
        data: newStation,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const updateData = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Station ID is required" }),
        { status: 400 }
      );
    }

    await dbConnect();
    const updatedStation = await StationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedStation) {
      return new Response(
        JSON.stringify({ success: false, message: "Station not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Station updated successfully",
        data: updatedStation,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
