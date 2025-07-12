// import dbConnect from "@/app/lib/dbConnect";
// import StationModel from "@/app/models/station";
// import MenuModel from "@/app/models/menu";
// import VendorModel from "@/app/models/vendor";
// import CategoryModel from "@/app/models/category";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     if (!body?.data || !Array.isArray(body?.data) || body?.data?.length === 0) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Invalid input data" }),
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const menuItem = body?.data[0];
//     if (!menuItem["GROUP_ID"]) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "GROUP_ID is required in the input data",
//         }),
//         { status: 400 }
//       );
//     }
//     await MenuModel.deleteMany({ Group_Id: menuItem["GROUP_ID"] });

//     for (const item of body?.data) {
//       if (
//         !item["GROUP_ID"] ||
//         !item["STATION_ID"] ||
//         !item["VENDOR_ID"] ||
//         !item["CATEGORY_ID"] ||
//         !item["ITEM_NAME"] ||
//         !item["PRICE"]
//       ) {
//         return new Response(
//           JSON.stringify({
//             success: false,
//             message:
//               "Missing required fields, [GROUP_ID, STATION_ID, VENDOR_ID, CATEGORY_ID, ITEM_NAME, PRICE] are required",
//           }),
//           { status: 400 }
//         );
//       }

//       const station = await StationModel.findOne({
//         stationId: item["STATION_ID"],
//       });

//       if (!station) {
//         return new Response(
//           JSON.stringify({
//             success: false,
//             message: `Station with ID ${item["STATION_ID"]} not found`,
//           }),
//           { status: 404 }
//         );
//       }

//       const category = await CategoryModel.findOne({
//         categoryid: item["CATEGORY_ID"],
//       });
//       if (!category) {
//         return new Response(
//           JSON.stringify({
//             success: false,
//             message: `Category with ID ${item["CATEGORY_ID"]} not found`,
//           }),
//           { status: 404 }
//         );
//       }

//       const vendor = await VendorModel.findOne({
//         vendorId: item["VENDOR_ID"],
//       });

//       if (!vendor) {
//         return new Response(
//           JSON.stringify({
//             success: false,
//             message: `Vendor with ID ${item["VENDOR_ID"]} not found`,
//           }),
//           { status: 404 }
//         );
//       }

//       const newItem = {
//         Group_Id: item["GROUP_ID"],
//         Station: station ? station._id : null,
//         Vendor: vendor ? vendor._id : null,
//         Category_Id: category ? category._id : null,
//         Item_Name: item["ITEM_NAME"] || "",
//         Description: item["DESCRIPTION"] || "",
//         Price: parseFloat(item["PRICE"]) || 0,
//         image: item["IMAGE"] || "",
//           Discount: parseFloat(item["DISCOUNT"]) || 0,
//   Food_Type: item["FOOD_TYPE"] == 1 ? "Non-Vegetarian" : "Vegetarian"
// };

//       //   Discount: parseFloat(item["DISCOUNT(%)"]) || 0,
//       //   Food_Type:
//       //     item["FOOD_TYPE(0=Veg | 1=Nonveg)"] == 1
//       //       ? "Non-Vegetarian"
//       //       : "Vegetarian",
//       // };


//       const menuItem = new MenuModel(newItem);
//       await menuItem.save();
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Menu Items Imported Successfully",
//       }),
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, message: error.message }),
//       { status: 500 }
//     );
//   }
// }


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

    const docs = body.data.map(item => ({
      Group_Id: item["GROUP_ID"],
      Station: stationMap[item["STATION_ID"]],
      Vendor: vendorMap[item["VENDOR_ID"]],
      Category_Id: categoryMap[item["CATEGORY_ID"]],
      Item_Name: item["ITEM_NAME"] || "",
      Description: item["DESCRIPTION"] || "",
      Price: parseFloat(item["PRICE"]) || 0,
      image: item["IMAGE"] || "",
      Discount: parseFloat(item["DISCOUNT"]) || 0,
      Food_Type: item["FOOD_TYPE"] == 1 ? "Non-Vegetarian" : "Vegetarian",
    }));

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
