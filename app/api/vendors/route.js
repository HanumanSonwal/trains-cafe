import dbConnect from "@/app/lib/dbConnect";
import VendorModel from "@/app/models/vendor";
import StationModel from "@/app/models/station";



export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get("search") || "").trim();
    const stationname = url.searchParams.get("stationname");
    const stationcode = url.searchParams.get("stationcode");
    const vendorname = url.searchParams.get("vendorname");
    const page = parseInt(url.searchParams.get("page"), 10) || 1;
    const limit = parseInt(url.searchParams.get("limit"), 10) || 10;

    await dbConnect();

    let andConditions = [];

    // 🔍 Search by keyword (station name/code or vendor)
    if (search) {
      const stations = await StationModel.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      });

      const stationIds = stations.map((station) => station._id);

      andConditions.push({
        $or: [
          { Station: { $in: stationIds } },
          { Vendor_Name: { $regex: search, $options: "i" } },
        ],
      });
    }

    // ✅ Filter by stationname
    if (stationname) {
      const station = await StationModel.findOne({
        name: { $regex: `^${stationname}$`, $options: "i" },
      });
      if (!station) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid Station Name" }),
          { status: 404 }
        );
      }
      andConditions.push({ Station: station._id });
    }

    // ✅ Filter by stationcode — FIXED: Exact match with ignore case
    if (stationcode) {
      const station = await StationModel.findOne({
        code: { $regex: `^${stationcode}$`, $options: "i" },
      });
      if (!station) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid Station Code" }),
          { status: 404 }
        );
      }
      andConditions.push({ Station: station._id });
    }

    // ✅ Filter by Vendor Name
    if (vendorname) {
      andConditions.push({
        Vendor_Name: { $regex: vendorname, $options: "i" },
      });
    }

    const searchCriteria =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const skip = Math.max((page - 1) * limit, 0);

    const vendors = await VendorModel.find(searchCriteria)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("Station", "name code");

    if (vendors.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No vendors found for the given filters",
        }),
        { status: 404 }
      );
    }

    const formatted = vendors.map((item) => ({
      ...item.toObject(),
      Station: item.Station?._id || "Unknown",
      Station_Name: item.Station?.name || "Unknown",
      Station_Code: item.Station?.code || "Unknown",
    }));

    const total = await VendorModel.countDocuments(searchCriteria);

    return new Response(
      JSON.stringify({
        success: true,
        data: formatted,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching vendors",
      }),
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const body = await req.json();

    if (
      !body.Vendor_Name ||
      !body.image ||
      !body.Contact_No ||
      !body.Station ||
      !body.Delivery_Charges ||
      !body.Min_Order_Value
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All required fields must be filled",
        }),
        { status: 400 }
      );
    }

    if (!Array.isArray(body.Food_Type) || body.Food_Type.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Food_Type must be a non-empty array",
        }),
        { status: 400 }
      );
    }

    const validTypes = ["Vegetarian", "Non-Vegetarian"];
    for (const type of body.Food_Type) {
      if (!validTypes.includes(type)) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Invalid Food_Type value: ${type}`,
          }),
          { status: 400 }
        );
      }
    }

    await dbConnect();
    const newVendor = new VendorModel(body);
    await newVendor.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vendor added successfully",
        data: newVendor,
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
        JSON.stringify({ success: false, message: "Vendor ID is required" }),
        { status: 400 }
      );
    }

    if (updateData.Food_Type) {
      if (!Array.isArray(updateData.Food_Type) || updateData.Food_Type.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Food_Type must be a non-empty array",
          }),
          { status: 400 }
        );
      }

      const validTypes = ["Vegetarian", "Non-Vegetarian"];
      for (const type of updateData.Food_Type) {
        if (!validTypes.includes(type)) {
          return new Response(
            JSON.stringify({
              success: false,
              message: `Invalid Food_Type value: ${type}`,
            }),
            { status: 400 }
          );
        }
      }
    }

    await dbConnect();
    const updatedVendor = await VendorModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedVendor) {
      return new Response(
        JSON.stringify({ success: false, message: "Vendor not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vendor updated successfully",
        data: updatedVendor,
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

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Vendor ID is required",
        }),
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedVendor = await VendorModel.findByIdAndDelete(id);

    if (!deletedVendor) {
      return new Response(
        JSON.stringify({ success: false, message: "Vendor not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vendor deleted successfully",
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
