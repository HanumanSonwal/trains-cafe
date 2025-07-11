import dbConnect from "@/app/lib/dbConnect";
import StationModel from "@/app/models/station";
import MenuModel from "@/app/models/menu";
import VendorModel from "@/app/models/vendor";
import CategoryModel from "@/app/models/category";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.data || !Array.isArray(body?.data) || body?.data?.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid input data" }),
        { status: 400 }
      );
    }

    await dbConnect();

    const menuItem = body?.data[0];
    if (!menuItem["GROUP_ID"]) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "GROUP_ID is required in the input data",
        }),
        { status: 400 }
      );
    }
    await MenuModel.deleteMany({ Group_Id: menuItem["GROUP_ID"] });

    for (const item of body?.data) {
      if (
        !item["GROUP_ID"] ||
        !item["STATION_ID"] ||
        !item["VENDOR_ID"] ||
        !item["CATEGORY_ID"] ||
        !item["ITEM_NAME"] ||
        !item["PRICE"]
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            message:
              "Missing required fields, [GROUP_ID, STATION_ID, VENDOR_ID, CATEGORY_ID, ITEM_NAME, PRICE] are required",
          }),
          { status: 400 }
        );
      }

      const station = await StationModel.findOne({
        stationId: item["STATION_ID"],
      });

      if (!station) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Station with ID ${item["STATION_ID"]} not found`,
          }),
          { status: 404 }
        );
      }

      const category = await CategoryModel.findOne({
        categoryid: item["CATEGORY_ID"],
      });
      if (!category) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Category with ID ${item["CATEGORY_ID"]} not found`,
          }),
          { status: 404 }
        );
      }

      const vendor = await VendorModel.findOne({
        vendorId: item["VENDOR_ID"],
      });

      if (!vendor) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Vendor with ID ${item["VENDOR_ID"]} not found`,
          }),
          { status: 404 }
        );
      }

      const newItem = {
        Group_Id: item["GROUP_ID"],
        Station: station ? station._id : null,
        Vendor: vendor ? vendor._id : null,
        Category_Id: category ? category._id : null,
        Item_Name: item["ITEM_NAME"] || "",
        Description: item["DESCRIPTION"] || "",
        Price: parseFloat(item["PRICE"]) || 0,
        image: item["IMAGE"] || "",
          Discount: parseFloat(item["DISCOUNT"]) || 0,
  Food_Type: item["FOOD_TYPE"] == 1 ? "Non-Vegetarian" : "Vegetarian"
};

      //   Discount: parseFloat(item["DISCOUNT(%)"]) || 0,
      //   Food_Type:
      //     item["FOOD_TYPE(0=Veg | 1=Nonveg)"] == 1
      //       ? "Non-Vegetarian"
      //       : "Vegetarian",
      // };


      const menuItem = new MenuModel(newItem);
      await menuItem.save();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Menu Items Imported Successfully",
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
