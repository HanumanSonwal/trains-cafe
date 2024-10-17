import dbConnect from '../../lib/dbConnect';
import MenuModel from '../../models/menu';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get('categoryId'); // Use 'categoryId'
    const vendorId = url.searchParams.get('vendorId');     // Use 'vendorId'
    const page = parseInt(url.searchParams.get('page'), 10) || 1;
    const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

    // Check if both categoryId and vendorId are provided
    if (!categoryId || !vendorId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Both categoryId and vendorId are required' }),
        { status: 400 }
      );
    }

    await dbConnect();

    // Create search criteria
    const searchCriteria = {
      Category_Id: categoryId, // Assuming this is a string or ObjectId
      Vendor: vendorId          // Use 'Vendor' to match your schema
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    const menu = await MenuModel.find(searchCriteria)
      .skip(skip)
      .limit(limit);

    const total = await MenuModel.countDocuments(searchCriteria);

    // Check if there are no results
    if (menu.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No matching records found', total, page, totalPages: Math.ceil(total / limit) }),
        { status: 404 } // Not found
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: menu,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching menus' }),
      { status: 500 }
    );
  }
}
