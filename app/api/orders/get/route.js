// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import station from '@/app/models/station';
// import vendor from '@/app/models/vendor';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = parseInt(searchParams.get("page") || 1, 10);
//         const limit = parseInt(searchParams.get("limit") || 10, 10);
//         const status = searchParams.get("status")?.trim();
//         const startDate = searchParams.get("startDate");
//         const endDate = searchParams.get("endDate");

//         await dbConnect();

//         const options = {
//             page,
//             limit,
//             sort: { createdAt: -1 },
//         };

//         const searchOptions = {};

//         if (status) {
//             searchOptions.status = status;
//         }

//         if (startDate && endDate) {
//             searchOptions.createdAt = {
//                 $gte: new Date(startDate),
//                 $lte: new Date(endDate)
//             };
//         }

//         const orders = await Order.paginate(searchOptions, options);

//         if (!orders || orders.docs.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Orders not found"
//             });
//         }

//         const ordersWithDetails = await Promise.all(
//             orders.docs.map(async (order) => {
//                 const vendorDetails = await vendor.findById(order.vendor).select("Vendor_Name Contact_No");
//                 const stationDetails = await station.findById(order.station).select("Station_Name Station_Code");

//                 return {
//                     ...order.toObject(),
//                     vendorDetails: vendorDetails || null,
//                     stationDetails: stationDetails || null,
//                 };
//             })
//         );

//         return NextResponse.json({
//             success: true,
//             ...orders,
//             docs: ordersWithDetails,
//         });

//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message,
//         });
//     }
// }
import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import OrderItems from '@/app/models/orderItems';
import Menu from '@/app/models/menu';
import { NextResponse } from 'next/server';
import '@/app/models/vendor';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // ✅ Fix: get ID from query param

    if (!id) {
      return NextResponse.json({ success: false, message: 'Order ID not provided' }, { status: 400 });
    }

    await dbConnect();

    const order = await Order.findById(id).populate({
      path: 'vendor',
      select: 'Vendor_Name',
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const orderItems = await OrderItems.find({ Order_Id: id }).populate({
      path: 'Item_Id',
      model: Menu,
      select: 'Item_Name image Price Food_Type Description',
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
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      order: {
        ...order.toObject(),
        Vendor_Name: order.vendor?.Vendor_Name || null,
        Items: items,
        vendor: undefined, // hide raw vendor ref
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
