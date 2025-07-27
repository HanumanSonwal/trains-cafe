import dbConnect from "@/app/lib/dbConnect";
import Menu from "@/app/models/menu";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { id } = context.params;
    const veg = req.nextUrl.searchParams.get("veg");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Vendor ID not found" },
        { status: 404 }
      );
    }

    await dbConnect();

    const foodType = veg === "true" ? "Vegetarian" : "Non-Vegetarian";

    const menuItems = await Menu.aggregate([
      {
        $match: {
          Vendor: new mongoose.Types.ObjectId(id),
          Food_Type: foodType,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "Category_Id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "vendors",
          localField: "Vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: "$vendor" },
      {
        $lookup: {
          from: "stations",
          localField: "Station",
          foreignField: "_id",
          as: "station",
        },
      },
      { $unwind: "$station" },
      {
        $group: {
          _id: null,
          categories: {
            $push: {
              categoryId: "$category._id", // ✅ Added categoryId
              categoryName: "$category.title",
              categoryImage: "$category.image",
              vendor: "$vendor.Vendor_Name",
              station: "$station.name",
              items: {
                _id: "$_id",
                name: "$Item_Name",
                price: "$Price",
                description: "$Description",
                vendor: "$vendor.Vendor_Name",
                discount: "$Discount",
                foodType: "$Food_Type",
                image: "$image",
              },
            },
          },
        },
      },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories.categoryId", // ✅ Use actual ObjectId here
          categoryId: { $first: "$categories.categoryId" },
          categoryName: { $first: "$categories.categoryName" },
          categoryImage: { $first: "$categories.categoryImage" },
          vendor: { $first: "$categories.vendor" },
          station: { $first: "$categories.station" },
          items: { $push: "$categories.items" },
        },
      },
    ]);

    if (!menuItems.length) {
      return NextResponse.json(
        { success: false, message: "No menu items found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
