import dbConnect from "@/app/lib/dbConnect";
import StationModel from "@/app/models/station";

export async function PUT(req) {
  try {
    await dbConnect();

    // Get stations that don't have stationId
    const stationsToUpdate = await StationModel.find({
      stationId: { $exists: false },
    });

    if (stationsToUpdate.length === 0) {
      return res
        .status(200)
        .json({ message: "All stations already have stationId" });
    }

    // Get the current max stationId
    const lastStationWithId = await StationModel.findOne({
      stationId: { $exists: true },
    }).sort({ stationId: -1 });

    let nextStationId = lastStationWithId ? lastStationWithId.stationId + 1 : 1;

    for (const station of stationsToUpdate) {
      await StationModel.updateOne(
        { _id: station._id },
        { $set: { stationId: nextStationId++ } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "stationId assigned successfully",
        updatedCount: stationsToUpdate.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching stations",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
