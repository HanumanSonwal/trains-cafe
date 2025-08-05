// // import dbConnect from '@/app/lib/dbConnect';
// // import Order from '@/app/models/order';
// // import station from '@/app/models/station';
// // import vendor from '@/app/models/vendor';
// // import { NextResponse } from 'next/server';

// // export async function GET(req) {
// //     try {
// //         const { searchParams } = new URL(req.url);
// //         const page = parseInt(searchParams.get("page") || 1, 10);
// //         const limit = parseInt(searchParams.get("limit") || 10, 10);
// //         const status = searchParams.get("status")?.trim();
// //         const startDate = searchParams.get("startDate");
// //         const endDate = searchParams.get("endDate");

// //         await dbConnect();

// //         const options = {
// //             page,
// //             limit,
// //             sort: { createdAt: -1 },
// //         };

// //         const searchOptions = {};

// //         if (status) {
// //             searchOptions.status = status;
// //         }

// //         if (startDate && endDate) {
// //             searchOptions.createdAt = {
// //                 $gte: new Date(startDate),
// //                 $lte: new Date(endDate)
// //             };
// //         }

// //         const orders = await Order.paginate(searchOptions, options);

// //         if (!orders || orders.docs.length === 0) {
// //             return NextResponse.json({
// //                 success: false,
// //                 message: "Orders not found"
// //             });
// //         }

// //         const ordersWithDetails = await Promise.all(
// //             orders.docs.map(async (order) => {
// //                 const vendorDetails = await vendor.findById(order.vendor).select("Vendor_Name Contact_No");
// //                 const stationDetails = await station.findById(order.station).select("Station_Name Station_Code");

// //                 return {
// //                     ...order.toObject(),
// //                     vendorDetails: vendorDetails || null,
// //                     stationDetails: stationDetails || null,
// //                 };
// //             })
// //         );

// //         return NextResponse.json({
// //             success: true,
// //             ...orders,
// //             docs: ordersWithDetails,
// //         });

// //     } catch (error) {
// //         return NextResponse.json({
// //             success: false,
// //             message: error.message,
// //         });
// //     }
// // }
// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import OrderItems from '@/app/models/orderItems';
// import Menu from '@/app/models/menu';
// import { NextResponse } from 'next/server';
// import '@/app/models/vendor';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id'); // ✅ Fix: get ID from query param

//     if (!id) {
//       return NextResponse.json({ success: false, message: 'Order ID not provided' }, { status: 400 });
//     }

//     await dbConnect();

//     const order = await Order.findById(id).populate({
//       path: 'vendor',
//       select: 'Vendor_Name',
//     });

//     if (!order) {
//       return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
//     }

//     const orderItems = await OrderItems.find({ Order_Id: id }).populate({
//       path: 'Item_Id',
//       model: Menu,
//       select: 'Item_Name image Price Food_Type Description',
//     });

//     const items = orderItems.map((oi) => ({
//       Quantity: oi.Quantity,
//       Price: oi.Price,
//       MenuItem: oi.Item_Id
//         ? {
//             Item_Id: oi.Item_Id._id,
//             Item_Name: oi.Item_Id.Item_Name,
//             image: oi.Item_Id.image,
//             Price: oi.Item_Id.Price,
//             Food_Type: oi.Item_Id.Food_Type,
//             Description: oi.Item_Id.Description,
//           }
//         : null,
//     }));

//     return NextResponse.json({
//       success: true,
//       order: {
//         ...order.toObject(),
//         Vendor_Name: order.vendor?.Vendor_Name || null,
//         Items: items,
//         vendor: undefined, // hide raw vendor ref
//       },
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       message: error.message,
//     }, { status: 500 });
//   }
// // }
// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import OrderItems from '@/app/models/orderItems';
// import Menu from '@/app/models/menu';
// import Vendor from '@/app/models/vendor';
// import Station from '@/app/models/station';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ success: false, message: 'Order ID not provided' }, { status: 400 });
//     }

//     await dbConnect();

//     // ✅ Populate vendor and station in one go
//     const order = await Order.findById(id)
//       .populate({ path: 'vendor', model: Vendor })
//       .populate({ path: 'station', model: Station });

//     if (!order) {
//       return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
//     }

//     const orderItems = await OrderItems.find({ Order_Id: id }).populate({
//       path: 'Item_Id',
//       model: Menu,
//       select: 'Item_Name image Price Food_Type Description',
//     });

//     const items = orderItems.map((oi) => ({
//       Quantity: oi.Quantity,
//       Price: oi.Price,
//       MenuItem: oi.Item_Id
//         ? {
//             Item_Id: oi.Item_Id._id,
//             Item_Name: oi.Item_Id.Item_Name,
//             image: oi.Item_Id.image,
//             Price: oi.Item_Id.Price,
//             Food_Type: oi.Item_Id.Food_Type,
//             Description: oi.Item_Id.Description,
//           }
//         : null,
//     }));

//     // ✅ Structure clean Vendor and Station data
//     const vendorDetails = order.vendor
//       ? {
//           _id: order.vendor._id,
//           Vendor_Name: order.vendor.Vendor_Name,
//           Contact_No: order.vendor.Contact_No,
//           image: order.vendor.image,
//           Alternate_Contact_No: order.vendor.Alternate_Contact_No,
//           Station: order.vendor.Station,
//           Delivery_Charges: order.vendor.Delivery_Charges,
//           Min_Order_Value: order.vendor.Min_Order_Value,
//           Min_Order_Time: order.vendor.Min_Order_Time,
//           Working_Time: order.vendor.Working_Time,
//           Weekly_Off: order.vendor.Weekly_Off,
//           Food_Type: order.vendor.Food_Type,
//           Description: order.vendor.Description,
//           Address: order.vendor.Address,
//           Status: order.vendor.Status,
//           vendorId: order.vendor.vendorId,
//         }
//       : null;

//     const stationDetails = order.station
//       ? {
//           _id: order.station._id,
//           name: order.station.name,
//           code: order.station.code,
//           location: order.station.location,
//           address: order.station.address,
//           status: order.station.status,
//           stationId: order.station.stationId,
//         }
//       : null;

//     return NextResponse.json({
//       success: true,
//       order: {
//         ...order.toObject(),
//         Vendor_Name: order.vendor?.Vendor_Name || null,
//         Vendor_Details: vendorDetails,
//         Station_Details: stationDetails,
//         Items: items,
//         vendor: undefined,
//         station: undefined,
//       },
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       message: error.message,
//     }, { status: 500 });
//   }
// }

import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import OrderItems from '@/app/models/orderItems';
import Menu from '@/app/models/menu';
import Vendor from '@/app/models/vendor';
import Station from '@/app/models/station';
import Category from '@/app/models/category'; // ✅ import category model
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Order ID not provided' }, { status: 400 });
    }

    await dbConnect();

    const order = await Order.findById(id)
      .populate({ path: 'vendor', model: Vendor })
      .populate({ path: 'station', model: Station });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const orderItems = await OrderItems.find({ Order_Id: id }).populate({
      path: 'Item_Id',
      model: Menu,
      select: 'Item_Name image Price Food_Type Description Category_Id',
      populate: {
        path: 'Category_Id',
        model: Category,
        select: 'title image',
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
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
