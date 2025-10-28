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

    const stationIds = [...new Set(body.data.map(item => item["STATION_ID"]))];
    const vendorIds = [...new Set(body.data.map(item => item["VENDOR_ID"]))];
    const categoryIds = [...new Set(body.data.map(item => item["CATEGORY_ID"]))];

    const stations = await StationModel.find({ stationId: { $in: stationIds } });
    const vendors = await VendorModel.find({ vendorId: { $in: vendorIds } });
    const categories = await CategoryModel.find({ categoryid: { $in: categoryIds } });

    const stationMap = {};
    stations.forEach(st => { stationMap[st.stationId] = st._id; });

    const vendorMap = {};
    vendors.forEach(v => { vendorMap[v.vendorId] = v._id; });

    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.categoryid] = c._id; });

    for (const item of body.data) {
      if (!stationMap[item["STATION_ID"]]) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Station with ID ${item["STATION_ID"]} not found`,
          }),
          { status: 404 }
        );
      }
      if (!vendorMap[item["VENDOR_ID"]]) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Vendor with ID ${item["VENDOR_ID"]} not found`,
          }),
          { status: 404 }
        );
      }
      if (!categoryMap[item["CATEGORY_ID"]]) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Category with ID ${item["CATEGORY_ID"]} not found`,
          }),
          { status: 404 }
        );
      }
    }
const docs = body.data.map(item => {
  const price = parseFloat(item["PRICE"]) || 0;
  const discount = parseFloat(item["DISCOUNT"]) || 0;
  const finalPrice = price - (price * discount) / 100;

  return {
    Group_Id: item["GROUP_ID"],
    Station: stationMap[item["STATION_ID"]],
    Vendor: vendorMap[item["VENDOR_ID"]],
    Category_Id: categoryMap[item["CATEGORY_ID"]],
    Item_Name: item["ITEM_NAME"] || "",
    Description: item["DESCRIPTION"] || "",
    Price: price,
    image: item["IMAGE"] || "",
    Discount: discount,
    Food_Type: item["FOOD_TYPE"] == 1 ? "Non-Vegetarian" : "Vegetarian",
    Final_Price: finalPrice, // <-- Added here
  };
});


    await MenuModel.insertMany(docs);

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
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
