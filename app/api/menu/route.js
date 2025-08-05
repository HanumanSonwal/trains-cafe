import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";
import MenuModel from "@/app/models/menu";
import VendorModel from "@/app/models/vendor";
import CategoryModel from "@/app/models/category";
import StationModel from "@/app/models/station";

// ✅ GET: Fetch menus with search & pagination
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get("search") || "").trim();
    const categoryName = url.searchParams.get("categoryName");
    const vendorname = url.searchParams.get("vendorname");
    const page = parseInt(url.searchParams.get("page"), 10) || 1;
    const limit = parseInt(url.searchParams.get("limit"), 10) || 10;

    await dbConnect();

    let searchCriteria = { $or: [] };

    if (search) {
      const categories = await CategoryModel.find({
        title: { $regex: search, $options: "i" },
      });
      if (categories.length > 0) {
        const categoryIds = categories.map((c) => new mongoose.Types.ObjectId(c._id));
        searchCriteria.$or.push({ Category_Id: { $in: categoryIds } });
      }

      const vendors = await VendorModel.find({
        Vendor_Name: { $regex: search, $options: "i" },
      });
      if (vendors.length > 0) {
        const vendorIds = vendors.map((v) => new mongoose.Types.ObjectId(v._id));
        searchCriteria.$or.push({ Vendor: { $in: vendorIds } });
      }

      searchCriteria.$or.push({ Item_Name: { $regex: search, $options: "i" } });
    }

    if (categoryName) {
      const category = await CategoryModel.findOne({ title: { $regex: categoryName, $options: "i" } });
      if (category) {
        searchCriteria.$or.push({ Category_Id: new mongoose.Types.ObjectId(category._id) });
      }
    }

    if (vendorname) {
      const vendor = await VendorModel.findOne({ Vendor_Name: { $regex: vendorname, $options: "i" } });
      if (vendor) {
        searchCriteria.$or.push({ Vendor: new mongoose.Types.ObjectId(vendor._id) });
      }
    }

    const skip = Math.max((page - 1) * limit, 0);

    const query = searchCriteria.$or.length > 0 ? searchCriteria : {};

    const menu = await MenuModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("Category_Id", "title")
      .populate("Vendor", "Vendor_Name")
      .populate("Station", "name");

    if (menu.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "No items found." }), { status: 404 });
    }

    const formatted = menu.map((item) => ({
      ...item.toObject(),
      Category_Id: item.Category_Id?._id || "Unknown",
      Category_Name: item.Category_Id?.title || "Unknown",
      Vendor: item.Vendor?._id || "Unknown",
      Vendor_Name: item.Vendor?.Vendor_Name || "Unknown",
      Station: item.Station?._id || "Unknown",
      Station_Name: item.Station?.name || "Unknown",
    }));

    const total = await MenuModel.countDocuments(query);

    return new Response(JSON.stringify({
      success: true,
      data: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }), { status: 200 });

  } catch (error) {
    console.error("GET Menu error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

// ✅ POST: Add new menu item (JSON only)// ✅ POST: Add new menu item (JSON only)
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.Group_Id) {
      body.Group_Id = `group_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    await dbConnect();

    body.Price = parseFloat(body.Price || "0");
    body.Discount = parseFloat(body.Discount || "0");
    body.Final_Price = parseFloat(body.Final_Price || "0");

    if (body.Category_Id) body.Category_Id = new mongoose.Types.ObjectId(body.Category_Id);
    if (body.Vendor) body.Vendor = new mongoose.Types.ObjectId(body.Vendor);
    if (body.Station) body.Station = new mongoose.Types.ObjectId(body.Station);

    // ✅ Validate: Food_Type must be String & valid
    const validTypes = ["Vegetarian", "Non-Vegetarian", "Vegan"];
    if (!body.Food_Type || !validTypes.includes(body.Food_Type)) {
      return new Response(
        JSON.stringify({ success: false, message: `Invalid Food_Type: ${body.Food_Type}` }),
        { status: 400 }
      );
    }

    // ✅ Validate vendor supports this type
    const vendor = await VendorModel.findById(body.Vendor).lean();
    if (!vendor) {
      return new Response(JSON.stringify({ success: false, message: "Vendor not found" }), { status: 404 });
    }
    if (!vendor.Food_Type.includes(body.Food_Type)) {
      return new Response(
        JSON.stringify({ success: false, message: `Vendor does not serve: ${body.Food_Type}` }),
        { status: 400 }
      );
    }

    await MenuModel.deleteMany({ Group_Id: body.Group_Id });

    const newMenu = new MenuModel(body);
    await newMenu.save();

    return new Response(
      JSON.stringify({ success: true, message: "Menu item saved successfully", data: newMenu }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Menu error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}


// ✅ PUT: Update menu status
// ✅ PUT: Update menu status or fields
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "Menu ID is required" }),
        { status: 400 }
      );
    }

    await dbConnect();

    // ✅ Agar Food_Type aa raha hai to validate karo:
    if (body.Food_Type) {
      const validTypes = ["Vegetarian", "Non-Vegetarian", "Vegan"];
      if (!validTypes.includes(body.Food_Type)) {
        return new Response(
          JSON.stringify({ success: false, message: `Invalid Food_Type: ${body.Food_Type}` }),
          { status: 400 }
        );
      }

      // ✅ Vendor se bhi cross check karo:
      if (body.Vendor) {
        const vendor = await VendorModel.findById(body.Vendor).lean();
        if (!vendor) {
          return new Response(
            JSON.stringify({ success: false, message: "Vendor not found" }),
            { status: 404 }
          );
        }
        if (!vendor.Food_Type.includes(body.Food_Type)) {
          return new Response(
            JSON.stringify({
              success: false,
              message: `Vendor does not serve: ${body.Food_Type}`,
            }),
            { status: 400 }
          );
        }
      } else {
        // Agar Vendor ID nahi bheja update me to purana Vendor nikaal ke check karo:
        const oldMenu = await MenuModel.findById(id).populate("Vendor").lean();
        if (oldMenu && oldMenu.Vendor && !oldMenu.Vendor.Food_Type.includes(body.Food_Type)) {
          return new Response(
            JSON.stringify({
              success: false,
              message: `Vendor does not serve: ${body.Food_Type}`,
            }),
            { status: 400 }
          );
        }
      }
    }

    const updatedMenu = await MenuModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedMenu) {
      return new Response(
        JSON.stringify({ success: false, message: "Menu not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Menu updated successfully", data: updatedMenu }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Menu error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}


// ✅ DELETE: Remove menu
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: "Menu ID is required" }), { status: 400 });
    }

    await dbConnect();

    const deleted = await MenuModel.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ success: false, message: "Menu not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "Menu deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("DELETE Menu error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
