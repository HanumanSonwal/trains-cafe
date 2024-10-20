import dbConnect from "@/app/lib/dbConnect";
import Menu from "@/app/models/menu";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        const { id } = context.params;
        const veg = req.nextUrl.searchParams.get("veg");           

        if (!id) {
            return NextResponse.json({ success: false, message: 'Vendor ID not found' }, { status: 404 });
        }
        
        await dbConnect();

        const foodType = veg === 'true' ? 'Vegetarian' : 'Non-Vegetarian';

        const menuItems = await Menu.aggregate([
            {
                $match: {
                    Vendor: new mongoose.Types.ObjectId(id),
                    Food_Type: foodType // Match based on the determined foodType
                },
            },
            {
                $lookup: {
                    from: "categories", // Assuming "categories" is the collection name for category data
                    localField: "Category_Id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category" // Unwind the category array to make it a single object
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "Vendor",
                    foreignField: "_id",
                    as: "vendor"
                }
            },
            {
                $unwind: "$vendor" // Unwind the vendor array to make it a single object
            },
            {
                $lookup: {
                    from: "stations",
                    localField: "Station",
                    foreignField: "_id",
                    as: "station"
                }
            },
            {
                $unwind: "$station" // Unwind the station array to make it a single object
            },
            {
                $group: {
                    _id: "$category._id", // Group by category ID
                    categoryName: { $first: "$category.title" }, // Get the category name
                    vendor: { $first: "$vendor.Vendor_Name" }, // Get the vendor details
                    station: { $first: "$station.name" }, // Get the station details
                    items: {
                        $push: {
                            _id: "$_id",
                            name: "$Item_Name",
                            price: "$Price",
                            description: "$Description",
                            vendor: "$vendor.Vendor_Name",
                            discount: "$Discount",
                            foodType: "$Food_Type",
                            image: "$image"
                        }
                    }
                }
            }
        ]);

        if (!menuItems.length) {
            return NextResponse.json({ success: false, message: 'No menu items found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: menuItems });
          
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
