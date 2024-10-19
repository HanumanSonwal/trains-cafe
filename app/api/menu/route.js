// // app/api/users/route.js
// import dbConnect from '../../lib/dbConnect';
// import MenuModel from '../../models/menu';
// import { requireRole } from '../../utils/auth';



// export async function GET(req) {
//   try {
//       const url = new URL(req.url);
//       const search = url.searchParams.get('search') || '';
//       const page = parseInt(url.searchParams.get('page'), 10) || 1;
//       const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

//       await dbConnect();

//       // Create search criteria
//       const searchCriteria = search ? {
//           $or: [
//             //   { Item_Name: { $regex: search, $options: 'i' } },
//             // { Station: { $regex: search, $options: 'i' } }
//              { Category_Id: { $regex: search, $options: 'i' } }
//           ]
//       } : {};

//       // Calculate pagination
//       const skip = (page - 1) * limit;

//       const menu = await MenuModel.find(searchCriteria)
//           .skip(skip)
//           .limit(limit);

//       const total = await MenuModel.countDocuments(searchCriteria);

//       return new Response(
//           JSON.stringify({
//               success: true,
//               data: menu,
//               total,
//               page,
//               totalPages: Math.ceil(total / limit)
//           }),
//           { status: 200 }
//       );
//   } catch (error) {
//       return new Response(
//           JSON.stringify({ success: false, message: 'Error fetching menus' }),
//           { status: 500 }
//       );
//   }
// }

// export async function POST(req, res) {
//     try {
//       //const body = await req.json();
//       const formData = await req.formData();
//       const body = Object.fromEntries(formData.entries());

//       await dbConnect();
//       const newMenu = new MenuModel(body);
//       await newMenu.save();
//       return new Response(JSON.stringify(newMenu), { status: 201 });
//     } catch (error) {
//       return new Response(JSON.stringify({ message: error.message }), { status: 500 });
//     }
// }

// export async function PUT(req) {
//     try {
//       const { searchParams } = new URL(req.url);
//       const id = searchParams.get('id');
//       const formData = await req.formData();
      
//       // Convert formData into a plain object
//       const updateData = Object.fromEntries(formData.entries());
  
//       if (!id) {
//         return new Response(JSON.stringify({ success: false, message: 'Menu ID is required' }), { status: 400 });
//       }
  
//       await dbConnect();
  
//       // Update menu by ID with the plain object of update data
//       const updatedMenu = await MenuModel.findByIdAndUpdate(id, updateData, { new: true });
  
//       if (!updatedMenu) {
//         return new Response(JSON.stringify({ success: false, message: 'Menu not found' }), { status: 404 });
//       }
  
//       return new Response(
//         JSON.stringify({
//           success: true,
//           message: 'Menu updated successfully',
//           data: updatedMenu,
//         }),
//         { status: 200 }
//       );
//     } catch (error) {
//       return new Response(
//         JSON.stringify({ success: false, message: error.message }),
//         { status: 500 }
//       );
//     }
//   }
  

// export async function DELETE(req) {
//   try {
//       const { id } = await req.json();

//       if (!id) {
//           return new Response(JSON.stringify({ success: false, message: 'menu ID is required' }), { status: 400 });
//       }

//       await dbConnect();
//       const deletedmenu = await MenuModel.findByIdAndDelete(id);
//       if (!deletedmenu) {
//           return new Response(JSON.stringify({ success: false, message: 'menu not found' }), { status: 404 });
//       }

//       return new Response(JSON.stringify({ success: true, message: 'menu deleted successfully' }), { status: 200 });
//   } catch (error) {
//       return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
//   }
// }



//app/api/users/route.js
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
//         { Item_Name: { $regex: search, $options: 'i' } },
//         { Station: { $regex: search, $options: 'i' } },
//         { Category_Id: { $regex: search, $options: 'i' } }
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
// import dbConnect from '../../lib/dbConnect';
// import MenuModel from '../../models/menu';
// import { requireRole } from '../../utils/auth';
// import CategoryModel from '../../models/category';

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
//         { Item_Name: { $regex: search, $options: 'i' } },
//         { Station: { $regex: search, $options: 'i' } },
//         { Category_Id: { $regex: search, $options: 'i' } }
//       ]
//     } : {};

//     // Calculate pagination
//     const skip = (page - 1) * limit;

//     // Find menu items and populate category details (categoryId and categoryName)
//     let menu = await MenuModel.find(searchCriteria)
//       .skip(skip)
//       .limit(limit)
//       .populate('Category_Id', 'title')  // Populate only the 'title' field from CategoryModel
//       .populate('Vendor', 'Vendor_Name');  // Populate only the 'Vendor_Name' field from Vendor model

//     // Map the response to include Category_Id, Category_Name, Vendor, and VendorName
//     menu = menu.map(item => ({
//       ...item.toObject(),
//       Category_Id: item.Category_Id?._id || 'Unknown', // Assign the actual category ID
//       Category_Name: item.Category_Id?.title || 'Unknown', // Assign the category title
//       Vendor: item.Vendor?.Vendor_Name || 'Unknown' // Assign the actual vendor ID
//       //VendorName: item.Vendor?.Vendor_Name || 'Unknown' // Assign the vendor name
//     }));
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
// import dbConnect from '../../lib/dbConnect';
// import MenuModel from '../../models/menu';
// import { requireRole } from '../../utils/auth';
// import CategoryModel from '../../models/category';
// import VendorModel from '../../models/vendor'; // Ensure this import is correct


// export async function GET(req) {
//   try {
//     const url = new URL(req.url);  // Ensure this line is included
//     const search = (url.searchParams.get('search') || '').trim();

//     const page = parseInt(url.searchParams.get('page'), 10) || 1 ;
//     const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

//     console.log(`Search: ${search}, Page: ${page}, Limit: ${limit}`);

//     await dbConnect();
//    // This ensures no leading/trailing spaces

//     // Create search criteria
//     const searchCriteria = search ? {
//       Item_Name: { $regex: search, $options: 'i' }, // Case-insensitive search for Item_Name
//     } : {};
    
//     // Add search by Category_Id if 'categoryId' param is provided and valid
//     // if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
//     //   searchCriteria.$and.push({
//     //     Category_Id: mongoose.Types.ObjectId(categoryId)
//     //   });
//     // }
    
//     console.log('Search Criteria:', searchCriteria);

//     // Calculate pagination
//     const skip = Math.max((page - 1) * limit, 0);
//     console.log('Skip:', skip);
  
//     // Find menu items
//     let menu = await MenuModel.find(searchCriteria)
//     .skip(skip)
//     .limit(limit)
//     .populate('Category_Id', 'title') // Populate only the 'title' field from CategoryModel
//     .populate('Vendor', 'Vendor_Name'); // Populate only the 'Vendor_Name' field from Vendor model
  
//   console.log('Menu Items:', menu);
//     if (menu.length === 0) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: 'No items found for the search criteria',
//         }),
//         { status: 404 }
//       );
//     }
//   // Map the response
//   menu = menu.map(item => ({
//     ...item.toObject(),
//     Category_Id: item.Category_Id?._id || 'Unknown',
//     Category_Name: item.Category_Id?.title || 'Unknown',
//     Vendor: item.Vendor?._id || 'Unknown',
//     Vendor_Name: item.Vendor?.Vendor_Name || 'Unknown', // Added for clarity
//   }));
//     const total = await MenuModel.countDocuments(searchCriteria);
//     console.log('Total Count:', total);
    
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
//     console.error('Error fetching menus:', error); // Log the error
//     return new Response(
//       JSON.stringify({ success: false, message: 'Error fetching menus' }),
//       { status: 500 }
//     );
//   }
// }
import dbConnect from '../../lib/dbConnect';
import MenuModel from '../../models/menu';
import CategoryModel from '../../models/category';
import VendorModel from '../../models/vendor'; // Ensure this import is correct
import mongoose from 'mongoose'; // For handling ObjectId

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').trim();
    // const categoryName = url.searchParams.get('categoryName');
    // const vendorname = url.searchParams.get('vendorname'); // Get categoryName from query params
    const page = parseInt(url.searchParams.get('page'), 10) || 1;
    const limit = parseInt(url.searchParams.get('limit'), 10) || 10;
    
    // console.log(`Search: ${search}, CategoryName: ${categoryName}, Page: ${page}, Limit: ${limit}`);
    // console.log(`Search: ${search}, VendorName: ${vendorname}, Page: ${page}, Limit: ${limit}`);

    await dbConnect();

    // Create search criteria for the menu items
    let searchCriteria = {};

    if (search) {
      // Check if the search term matches a category
      const category = await CategoryModel.findOne({ title: { $regex: search, $options: 'i' } });
      // Check if the search term matches a vendor
      const vendor = await VendorModel.findOne({ Vendor_Name: { $regex: search, $options: 'i' } });

      // If a category is found, filter by Category_Id
      if (category) {
        searchCriteria.Category_Id = new mongoose.Types.ObjectId(category._id);
      }

      // If a vendor is found, filter by Vendor
      if (vendor) {
        searchCriteria.Vendor = new mongoose.Types.ObjectId(vendor._id);
      }

      // Always search by Item_Name if there's a search term
      searchCriteria.Item_Name = { $regex: search, $options: 'i' };
    }

    // Search by Item_Name if provided
//     if (search) {
//       searchCriteria.Item_Name = { $regex: search, $options: 'i' }; // Case-insensitive search for Item_Name
      
//     }

//     // If categoryName is provided, find the matching category and filter by Category_Id
//     if (categoryName) {
//       const category = await CategoryModel.findOne({ title: { $regex: categoryName, $options: 'i' } });
//       if (category) {
//         searchCriteria.Category_Id = new mongoose.Types.ObjectId(category._id);
// // Use the found category's _id
//       }
       
    

    console.log('Search Criteria:', searchCriteria);

    // Calculate pagination
    const skip = Math.max((page - 1) * limit, 0);
    console.log('Skip:', skip);

    // Find menu items
    let menu = await MenuModel.find(searchCriteria)
      .skip(skip)
      .limit(limit)
      .populate('Category_Id', 'title') // Populate only the 'title' field from CategoryModel
      .populate('Vendor', 'Vendor_Name'); // Populate only the 'Vendor_Name' field from Vendor model

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
    }));

    // Get total number of matching documents for pagination
    const total = await MenuModel.countDocuments(searchCriteria);
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
