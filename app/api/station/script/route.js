import dbConnect from "@/app/lib/dbConnect";
import StationModel from "@/app/models/station";

export async function PUT(req) {
  try {
    await dbConnect();
    const stations = await StationModel.find().lean();
    let count = 0;

    await new Promise((res, rej) => {
      try {
        //   stations.forEach(async (_) => {
        //     await 
        // });
      } catch (error) {
        rej(error);
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
