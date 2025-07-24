// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = searchParams.get("page") || 1;
//         const limit = searchParams.get("limit") || 10;
//         const status = searchParams.get("status") || "processing";

//         await dbConnect();

//         const options = {
//             page: parseInt(page, 10),
//             limit: parseInt(limit, 10),
//             sort: { createdAt: -1 },
//         };

//         const searchOptions = {}

//         if (status == "processing") {
//             searchOptions.$in = ["processing", "pending"]
//         } else {
//             searchOptions.status = status
//         }

//         const orders = await Order.paginate(searchOptions, options);
        
//         if (!orders || orders.docs.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Orders not found"
//             })
//         }
//         return NextResponse.json({
//             success: true,
//             ...orders
//         })
//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         })
//     }
// }
// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = parseInt(searchParams.get("page") || 1, 10);
//         const limit = parseInt(searchParams.get("limit") || 10, 10);
//         const status = searchParams.get("status")?.trim(); // Trim spaces in case of blank inputs

//         await dbConnect();

//         const options = {
//             page,
//             limit,
//             sort: { createdAt: -1 },
//         };

//         const searchOptions = {};

//         // Apply filter based on the `status` parameter
//         if (status) {
//             if (status === "processing") {
//                 // If status is "processing", include "processing" and "pending" orders
//                 searchOptions.status = { $in: ["processing", "pending"] };
//             } else {
//                 // Filter by exact status if it's not "processing"
//                 searchOptions.status = status;
//             }
//         }
        
//         // Fetch orders with pagination and the defined search options
//         const orders = await Order.paginate(searchOptions, options);
        
//         if (!orders || orders.docs.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Orders not found"
//             });
//         }
        
//         return NextResponse.json({
//             success: true,
//             ...orders
//         });
//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = parseInt(searchParams.get("page") || "1", 10);
//         const limit = parseInt(searchParams.get("limit") || "10", 10);
//         const statusParam = searchParams.get("status")?.trim();
//         const payment_statusParam = searchParams.get("payment_status")?.trim();

//         await dbConnect();

//         const options = {
//             page,
//             limit,
//             sort: { createdAt: -1 },
//         };

//         const searchOptions = {};

//         // Only apply status filter if provided
//         if (statusParam) {
//             searchOptions.status = statusParam;
//         }
//         if (payment_statusParam) {
//             searchOptions["payment.payment_status"] = payment_statusParam;
//         }

//         const orders = await Order.paginate(searchOptions, options);

//         if (!orders || orders.docs.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Orders not found"
//             });
//         }

//         return NextResponse.json({
//             success: true,
//             ...orders
//         });
//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = parseInt(searchParams.get("page") || "1", 10);
//         const limit = parseInt(searchParams.get("limit") || "10", 10);
//         const statusParam = searchParams.get("status")?.trim();
//         const payment_statusParam = searchParams.get("payment_status")?.trim();
//         const fromDate = searchParams.get("from")?.trim();
//         const toDate = searchParams.get("to")?.trim();

//         await dbConnect();

//         const options = {
//             page,
//             limit,
//             sort: { createdAt: -1 },
//         };

//         const searchOptions = {};

//         // Status filter
//         if (statusParam) {
//             searchOptions.status = statusParam;
//         }

//         // Payment status filter (nested)
//         if (payment_statusParam) {
//             searchOptions["payment.payment_status"] = payment_statusParam;
//         }

//         // Date filter
//         if (fromDate || toDate) {
//             searchOptions.createdAt = {};

//             if (fromDate) {
//                 searchOptions.createdAt.$gte = new Date(fromDate);
//             }

//             if (toDate) {
//                 // Include the whole day by setting time to 23:59:59
//                 const toDateObj = new Date(toDate);
//                 toDateObj.setHours(23, 59, 59, 999);
//                 searchOptions.createdAt.$lte = toDateObj;
//             }
//         }

//         const orders = await Order.paginate(searchOptions, options);

//         if (!orders || orders.docs.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Orders not found"
//             });
//         }

//         return NextResponse.json({
//             success: true,
//             ...orders
//         });
//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// import dbConnect from '@/app/lib/dbConnect';
// import Order from '@/app/models/order';
// import { NextResponse } from 'next/server';
// import '@/app/models/vendor';

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = parseInt(searchParams.get("page") || "1", 10);
//         const limit = parseInt(searchParams.get("limit") || "10", 10);
//         const statusParam = searchParams.get("status")?.trim();
//         const payment_statusParam = searchParams.get("payment_status")?.trim();
//         const fromDate = searchParams.get("from")?.trim();
//         const toDate = searchParams.get("to")?.trim();

//         await dbConnect();

//         const options = {
//             page,
//             limit,
//             sort: { createdAt: -1 },
//             populate: {
//                 path: 'vendor',
//                 select: 'Vendor_Name'
//             }
//         };

//         const searchOptions = {};

//         if (statusParam) {
//             searchOptions.status = statusParam;
//         }

//         if (payment_statusParam) {
//             searchOptions["payment.payment_status"] = payment_statusParam;
//         }

//         if (fromDate || toDate) {
//             searchOptions.createdAt = {};

//             if (fromDate) {
//                 searchOptions.createdAt.$gte = new Date(fromDate);
//             }

//             if (toDate) {
//                 const toDateObj = new Date(toDate);
//                 toDateObj.setHours(23, 59, 59, 999);
//                 searchOptions.createdAt.$lte = toDateObj;
//             }
//         }

//         const rawOrders = await Order.paginate(searchOptions, options);

//         if (!rawOrders || rawOrders.docs.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Orders not found"
//             });
//         }

//         // Flatten vendor name
//         const formattedOrders = {
//             ...rawOrders,
//             docs: rawOrders.docs.map(order => {
//                 const orderObj = order.toObject();
//                 return {
//                     ...orderObj,
//                     vendor_name: orderObj.vendor?.Vendor_Name || null,
//                     vendor: undefined // remove original vendor object if not needed
//                 };
//             })
//         };

//         return NextResponse.json({
//             success: true,
//             ...formattedOrders
//         });

//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         });
//     }
// // }
// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = parseInt(searchParams.get("page") || "1", 10);
//         const limit = parseInt(searchParams.get("limit") || "10", 10);
//         const statusParam = searchParams.get("status")?.trim();
//         const payment_statusParam = searchParams.get("payment_status")?.trim();
//         const fromDate = searchParams.get("from")?.trim();
//         const toDate = searchParams.get("to")?.trim();

//         await dbConnect();

//         const options = {
//             page,
//             limit,
//             sort: { createdAt: -1 },
//             populate: {
//                 path: 'vendor',
//                 select: 'Vendor_Name '// select fields you want
//             },
//         };

//         const searchOptions = {};

//         if (statusParam) {
//             searchOptions.status = statusParam;
//         }

//         if (payment_statusParam) {
//             searchOptions["payment.payment_status"] = payment_statusParam;
//         }

//         if (fromDate || toDate) {
//             searchOptions.createdAt = {};

//             if (fromDate) {
//                 searchOptions.createdAt.$gte = new Date(fromDate);
//             }

//             if (toDate) {
//                 const toDateObj = new Date(toDate);
//                 toDateObj.setHours(23, 59, 59, 999);
//                 searchOptions.createdAt.$lte = toDateObj;
//             }
//         }

//         const orders = await Order.paginate(searchOptions, options);

//         if (!orders || orders.docs.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Orders not found"
//             });
//         }

//         return NextResponse.json({
//             success: true,
//             ...orders
//         });

//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         });
//     }
// }


import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import { NextResponse } from 'next/server';
import '@/app/models/vendor';
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

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: {
        path: 'vendor',
        select: 'Vendor_Name' 
      }
    };

    const searchOptions = {};

    if (statusParam) {
      searchOptions.status = statusParam;
    }

    if (payment_statusParam) {
      searchOptions["payment.payment_status"] = payment_statusParam;
    }

    if (fromDate || toDate) {
      searchOptions.createdAt = {};
      if (fromDate) {
        searchOptions.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        const toDateObj = new Date(toDate);
        toDateObj.setHours(23, 59, 59, 999);
        searchOptions.createdAt.$lte = toDateObj;
      }
    }

    const orders = await Order.paginate(searchOptions, options);

    if (!orders || orders.docs.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Orders not found"
      });
    }

    const transformedDocs = orders.docs.map(order => {
      const vendor = order.vendor || {};
      return {
        ...order.toObject(),
        Vendor_Name: vendor.Vendor_Name || null,
        _id: order._id, 
        vendor: undefined 
      };
    });

    return NextResponse.json({
      success: true,
      ...orders,
      docs: transformedDocs
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}
