import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import OrderItems from '@/app/models/orderItems';
import Menu from '@/app/models/menu';
import { NextResponse } from 'next/server';
import '@/app/models/vendor';
import '@/app/models/station';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const statusParam = searchParams.get("status")?.trim();
    const payment_statusParam = searchParams.get("payment_status")?.trim();
    const fromDate = searchParams.get("from")?.trim();
    const toDate = searchParams.get("to")?.trim();

    await dbConnect();

    // const options = {
    //   page,
    //   limit,
    //   sort: { createdAt: -1 },
    //   populate: {
    //     path: 'vendor',
    //     select: 'Vendor_Name',
    //   },
    // };
   const options = {
  page,
  limit,
  sort: { createdAt: -1 },
  populate: [
    {
      path: 'vendor',
      model: 'vendor'
    },
    {
      path: 'station',
      model: 'Station'
    }
  ]
};

    

    const searchOptions = {};

    if (statusParam) searchOptions.status = statusParam;
    if (payment_statusParam) searchOptions["payment.payment_status"] = payment_statusParam;

    if (fromDate || toDate) {
      searchOptions.createdAt = {};
      if (fromDate) searchOptions.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        searchOptions.createdAt.$lte = to;
      }
    }

    const orders = await Order.paginate(searchOptions, options);

    if (!orders || orders.docs.length === 0) {
      return NextResponse.json({ success: false, message: "Orders not found" });
    }

    // Fetch order items for each order
    const enrichedOrders = await Promise.all(orders.docs.map(async (order) => {
      const vendor = order.vendor || {};
      
  const station = order.station || {}; // ✅ FIXED HERE


      // Find all OrderItems related to this order
      const orderItems = await OrderItems.find({ Order_Id: order._id }).populate({
        path: 'Item_Id',
        model: Menu,
        select: 'Item_Name image Price Food_Type Description',
      });

      // Transform each orderItem
      const items = orderItems.map((oi) => ({
        Quantity: oi.Quantity,
        Price: oi.Price,
        MenuItem: oi.Item_Id ? {
          Item_Id: oi.Item_Id._id,
          Item_Name: oi.Item_Id.Item_Name,
          image: oi.Item_Id.image,
          Price: oi.Item_Id.Price,
          Food_Type: oi.Item_Id.Food_Type,
          Description: oi.Item_Id.Description,
        } : null
      }));

      return {
        ...order.toObject(),
        Vendor_Name: vendor.Vendor_Name || null,
       
         Vendor_Details: vendor, // include all vendor info
         //Station_Details: station,
        Items: items,
        vendor: undefined
      };
    }));

    return NextResponse.json({
      success: true,
      totalDocs: orders.totalDocs,
      limit: orders.limit,
      page: orders.page,
      totalPages: orders.totalPages,
      docs: enrichedOrders
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}
