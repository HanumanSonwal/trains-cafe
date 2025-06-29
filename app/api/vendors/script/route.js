import dbConnect from "@/app/lib/dbConnect";
import VendorModel from "@/app/models/vendor";

export async function PUT(req) {
  try {
    await dbConnect();

    // Get vendors that don't have vendorId
    const vendorsToUpdate = await VendorModel.find({
      vendorId: { $exists: false },
    });

    if (vendorsToUpdate.length === 0) {
      return new Response(
        JSON.stringify({ message: "All vendors already have vendorId" }),
        { status: 200 }
      );
    }

    // Get the current max vendorId
    const lastVendorWithId = await VendorModel.findOne({
      vendorId: { $exists: true },
    }).sort({ vendorId: -1 });

    let nextVendorId = 1;

    if (
      lastVendorWithId &&
      typeof lastVendorWithId.vendorId === "number" &&
      !isNaN(lastVendorWithId.vendorId)
    ) {
      nextVendorId = lastVendorWithId.vendorId + 1;
    }
    for (const vendor of vendorsToUpdate) {
      console.log(
        `Updating vendor ${vendor._id} with vendorId ${nextVendorId}`
      );

      await VendorModel.findByIdAndUpdate(vendor._id, {
        $set: { vendorId: nextVendorId++ },
      });
    }

    return new Response(
      JSON.stringify({
        message: "vendorId assigned successfully",
        updatedCount: vendorsToUpdate.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error assigning vendorId",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
