import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";
import Menu from "@/app/models/menu";
import Vendor from "@/app/models/vendor";
import Station from "@/app/models/station";
import Category from "@/app/models/category";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID not provided" },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findById(id)
      .populate({ path: "vendor", model: Vendor })
      .populate({ path: "station", model: Station });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const orderItems = await OrderItems.find({ Order_Id: id }).populate({
      path: "Item_Id",
      model: Menu,
      select: "Item_Name image Price Food_Type Description Category_Id",
      populate: {
        path: "Category_Id",
        model: Category,
        select: "title image",
      },
    });

    const items = orderItems.map((oi) => ({
      Quantity: oi.Quantity,
      Price: oi.Price,
      MenuItem: oi.Item_Id
        ? {
            Item_Id: oi.Item_Id._id,
            Item_Name: oi.Item_Id.Item_Name,
            image: oi.Item_Id.image,
            Price: oi.Item_Id.Price,
            Food_Type: oi.Item_Id.Food_Type,
            Description: oi.Item_Id.Description,
            Category: oi.Item_Id.Category_Id
              ? {
                  Category_Id: oi.Item_Id.Category_Id._id,
                  Title: oi.Item_Id.Category_Id.title,
                  Image: oi.Item_Id.Category_Id.image,
                }
              : null,
          }
        : null,
    }));

    const vendorDetails = order.vendor
      ? {
          _id: order.vendor._id,
          Vendor_Name: order.vendor.Vendor_Name,
          Contact_No: order.vendor.Contact_No,
          image: order.vendor.image,
          Alternate_Contact_No: order.vendor.Alternate_Contact_No,
          Station: order.vendor.Station,
          Delivery_Charges: order.vendor.Delivery_Charges,
          Min_Order_Value: order.vendor.Min_Order_Value,
          Min_Order_Time: order.vendor.Min_Order_Time,
          Working_Time: order.vendor.Working_Time,
          Weekly_Off: order.vendor.Weekly_Off,
          Food_Type: order.vendor.Food_Type,
          Description: order.vendor.Description,
          Address: order.vendor.Address,
          Status: order.vendor.Status,
          vendorId: order.vendor.vendorId,
        }
      : null;

    const stationDetails = order.station
      ? {
          _id: order.station._id,
          name: order.station.name,
          code: order.station.code,
          location: order.station.location,
          address: order.station.address,
          status: order.station.status,
          stationId: order.station.stationId,
        }
      : null;
    const total = order.total || 0;
    const advanced = order.payment?.advanced || 0;
    const remainingAmount = total - advanced;

    return NextResponse.json({
      success: true,
      order: {
        ...order.toObject(),
        Vendor_Name: order.vendor?.Vendor_Name || null,
        Vendor_Details: vendorDetails,
        Station_Details: stationDetails,
        Items: items,
        remainingAmount,
        vendor: undefined,
        station: undefined,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
