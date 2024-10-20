
import dbConnect from '../../lib/dbConnect';
import MenuModel from '../../models/menu';
import CategoryModel from '../../models/category';
import VendorModel from '../../models/vendor';
import StationModel from '../../models/station';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').trim();
    const categoryName = url.searchParams.get('categoryName');
    const vendorname = url.searchParams.get('vendorname');
    const page = parseInt(url.searchParams.get('page'), 10) || 1;
    const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

    console.log(`Search: ${search}, CategoryName: ${categoryName}, Page: ${page}, Limit: ${limit}`);
    console.log(`Search: ${search}, VendorName: ${vendorname}, Page: ${page}, Limit: ${limit}`);

    await dbConnect();

    // Create search criteria for the menu items
    let searchCriteria = { $or: [] };

    // Check if any search parameters are provided
    if (search) {
        // Check if the search term matches a category using regex for fuzzy matching
        const categories = await CategoryModel.find({
            title: { $regex: search, $options: 'i' }
        });

        if (categories.length > 0) {
            const categoryIds = categories.map(category => new mongoose.Types.ObjectId(category._id));
            searchCriteria.$or.push({ Category_Id: { $in: categoryIds } });
        }

        // Check if the search term matches a vendor using regex for fuzzy matching
        const vendors = await VendorModel.find({
            Vendor_Name: { $regex: search, $options: 'i' }
        });

        if (vendors.length > 0) {
            const vendorIds = vendors.map(vendor => new mongoose.Types.ObjectId(vendor._id));
            searchCriteria.$or.push({ Vendor: { $in: vendorIds } });
        }
      //   const stations = await StationModel.find({
      //     Station_Name: { $regex: search, $options: 'i' }
      // });

      // if (stations.length > 0) {
      //     const StationIds = stations.map(station => new mongoose.Types.ObjectId(station._id));
      //     searchCriteria.$or.push({ Station: { $in: stations } });
      // }

        // Always search by Item_Name if there's a search term
        searchCriteria.$or.push({ Item_Name: { $regex: search, $options: 'i' } });
    }

    // If categoryName is provided, find the matching category and filter by Category_Id
    if (categoryName) {
        const category = await CategoryModel.findOne({ title: { $regex: categoryName, $options: 'i' } });
        if (category) {
            searchCriteria.$or.push({ Category_Id: new mongoose.Types.ObjectId(category._id) });
        }
    }

    // If vendorname is provided, find the matching vendor and filter by Vendor
    if (vendorname) {
        const vendor = await VendorModel.findOne({ Vendor_Name: { $regex: vendorname, $options: 'i' } });
        if (vendor) {
            searchCriteria.$or.push({ Vendor: new mongoose.Types.ObjectId(vendor._id) });
        }
    }

    console.log('Search Criteria:', searchCriteria);

    // Calculate pagination
    const skip = Math.max((page - 1) * limit, 0);
    console.log('Skip:', skip);

    // If no search criteria are set, return all menu items
    let menu;
    if (searchCriteria.$or.length === 0) {
        menu = await MenuModel.find({})
            .skip(skip)
            .limit(limit)
            .populate('Category_Id', 'title')
            .populate('Vendor', 'Vendor_Name')
            .populate('Station', 'name');
    } else {
        // Find menu items with the search criteria
        menu = await MenuModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .populate('Category_Id', 'title')
            .populate('Station', 'name')
            .populate('Vendor', 'Vendor_Name');
    }

    console.log('Menu Items:', menu);

    if (menu.length === 0) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'No items found for the search criteria',
            }),
            { status: 404 }
        );
    }

    // Map the response
    menu = menu.map(item => ({
        ...item.toObject(),
        Category_Id: item.Category_Id?._id || 'Unknown',
        Category_Name: item.Category_Id?.title || 'Unknown',
        Vendor: item.Vendor?._id || 'Unknown',
        Vendor_Name: item.Vendor?.Vendor_Name || 'Unknown',
        Station: item.Station?._id || 'Unknown',
        Station_Name: item.Station?.name || 'Unknown',
    }));

    // Get total number of matching documents for pagination
    const total = await MenuModel.countDocuments(searchCriteria.$or.length === 0 ? {} : searchCriteria);
    console.log('Total Count:', total);

    return new Response(
        JSON.stringify({
            success: true,
            data: menu,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }),
        { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching menus:', error);
    return new Response(
        JSON.stringify({ success: false, message: 'Error fetching menus' }),
        { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    await dbConnect();
    const newMenu = new MenuModel(body);
    await newMenu.save();
    
    return new Response(JSON.stringify({ success: true, data: newMenu }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const formData = await req.formData();
    
    const updateData = Object.fromEntries(formData.entries());

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Menu ID is required' }), { status: 400 });
    }

    await dbConnect();

    const updatedMenu = await MenuModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMenu) {
      return new Response(JSON.stringify({ success: false, message: 'Menu not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Menu updated successfully',
        data: updatedMenu,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Menu ID is required' }), { status: 400 });
    }

    await dbConnect();
    const deletedMenu = await MenuModel.findByIdAndDelete(id);
    if (!deletedMenu) {
      return new Response(JSON.stringify({ success: false, message: 'Menu not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Menu deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
