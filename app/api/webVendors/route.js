// import dbConnect from '../../lib/dbConnect';
// import MenuModel from '../../models/menu';
// import { requireRole } from '../../utils/auth';

// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const search = url.searchParams.get('search') || '';
//     const page = parseInt(url.searchParams.get('page'), 10) || 1;
//     const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

//     await dbConnect();

//     // Create search criteria
//     const searchCriteria = search ? {
//       $or: [
//         { Vendor: { $regex: search, $options: 'i' } },
//         // { Item_Name: { $regex: search, $options: 'i' } },
//         // { Station: { $regex: search, $options: 'i' } },
//         // { Category_Id: { $regex: search, $options: 'i' } }
//       ]
//     } : {};

//     // Calculate pagination
//     const skip = (page - 1) * limit;

//     const menu = await MenuModel.find(searchCriteria)
//       .skip(skip)
//       .limit(limit);

//     const total = await MenuModel.countDocuments(searchCriteria);

//     return new Response(
//       JSON.stringify({
//         success: true,
//         data: menu,
//         total,
//         page,
//         totalPages: Math.ceil(total / limit)
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, message: 'Error fetching menus' }),
//       { status: 500 }
//     );
//   }
// }
import dbConnect from '../../lib/dbConnect';
import MenuModel from '../../models/menu';
import CategoryModel from '../../models/category';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page'), 10) || 1;
    const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

    await dbConnect();

    // Step 1: Search for the vendor(s)
    const vendorSearchCriteria = {
      Vendor: { $regex: search, $options: 'i' }
    };

    const vendors = await MenuModel.find(vendorSearchCriteria).select('Category_Id');
    
    if (vendors.length === 0) {
      return new Response(
        JSON.stringify({ success: true, data: [], total: 0, page, totalPages: 0 }),
        { status: 200 }
      );
    }

    // Collect all unique Category_Id values
    const categoryIds = [...new Set(vendors.map(vendor => vendor.Category_Id))];

    // Step 2: Fetch categories associated with the found vendor IDs
    const categorySearchCriteria = { _id: { $in: categoryIds } }; // Assuming Category_Id is stored as ObjectId

    // Calculate pagination for categories
    const skip = (page - 1) * limit;

    const categories = await CategoryModel.find(categorySearchCriteria)
      .skip(skip)
      .limit(limit);

    // Count total matching categories
    const total = await CategoryModel.countDocuments(categorySearchCriteria);

    return new Response(
      JSON.stringify({
        success: true,
        data: categories,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching categories' }),
      { status: 500 }
    );
  }
}
