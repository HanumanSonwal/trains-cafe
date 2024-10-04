// app/api/users/route.js
import dbConnect from '../../lib/dbConnect';
import MenuModel from '../../models/menu';
import { requireRole } from '../../utils/auth';



export async function GET(req) {
  try {
      const url = new URL(req.url);
      const search = url.searchParams.get('search') || '';
      const page = parseInt(url.searchParams.get('page'), 10) || 1;
      const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

      await dbConnect();

      // Create search criteria
      const searchCriteria = search ? {
          $or: [
              { Item_Name: { $regex: search, $options: 'i' } },
            { Station: { $regex: search, $options: 'i' } }
            , { Category: { $regex: search, $options: 'i' } }
          ]
      } : {};

      // Calculate pagination
      const skip = (page - 1) * limit;

      const menu = await MenuModel.find(searchCriteria)
          .skip(skip)
          .limit(limit);

      const total = await MenuModel.countDocuments(searchCriteria);

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

export async function POST(req, res) {
    try {
      //const body = await req.json();
      const formData = await req.formData();
      const body = Object.fromEntries(formData.entries());

      await dbConnect();
      const newMenu = new MenuModel(body);
      await newMenu.save();
      return new Response(JSON.stringify(newMenu), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function PUT(req) {
  try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const updateData = await req.formData();
      //const body = Object.fromEntries(updateData.entries());

      if (!id) {
          return new Response(JSON.stringify({ success: false, message: 'Menu ID is required' }), { status: 400 });
      }

      await dbConnect();
      const updatedmenu = await MenuModel.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!updatedmenu) {
          return new Response(JSON.stringify({ success: false, message: 'menu not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ success: true, message: 'menu updated successfully', data: updatedmenu }), { status: 200 });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
      const { id } = await req.json();

      if (!id) {
          return new Response(JSON.stringify({ success: false, message: 'menu ID is required' }), { status: 400 });
      }

      await dbConnect();
      const deletedmenu = await MenuModel.findByIdAndDelete(id);
      if (!deletedmenu) {
          return new Response(JSON.stringify({ success: false, message: 'menu not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ success: true, message: 'menu deleted successfully' }), { status: 200 });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
