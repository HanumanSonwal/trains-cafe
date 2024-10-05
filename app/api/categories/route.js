// app/api/users/route.js
import dbConnect from '../../lib/dbConnect';
import CategoryModel from '../../models/category';
import { requireRole } from '../../utils/auth';

// export async function handler(req, res) {
//   if (await requireRole(req, res, 'ADMIN')) {
//     // Your protected logic here
//     res.status(200).json({ message: 'Welcome Admin' });
//   }
// }

// export async function GET(req, res) {
//     try {
//       await dbConnect();
//       const categories = await CategoryModel.find({});
//       return new Response(JSON.stringify(categories), { status: 200 });
//     } catch (error) {
//       return new Response(JSON.stringify({ message: 'Error fetching categories' }), { status: 500 });
//     }
// }

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
              { title: { $regex: search, $options: 'i' } },
             
          ]
      } : {};

      // Calculate pagination
      const skip = (page - 1) * limit;

      const categories = await CategoryModel.find(searchCriteria)
          .skip(skip)
          .limit(limit);

      const total = await CategoryModel.countDocuments(searchCriteria);

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
          JSON.stringify({ success: false, message: 'Error fetching vendors' }),
          { status: 500 }
      );
  }
}

export async function POST(req, res) {
    try {
    //   const body = await req.json();
    const formData = await req.formData();
      const body = Object.fromEntries(formData.entries())

      await dbConnect();
      const newCategory = new CategoryModel(body);
      await newCategory.save();
      return new Response(JSON.stringify(newCategory), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
export async function PUT(req) {
  try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
    //   const updateData = await req.json(); 
    const formData = await req.formData();
    const updateData = Object.fromEntries(formData.entries())

      if (!id) {
          return new Response(JSON.stringify({ success: false, message: 'Category ID is required' }), { status: 400 });
      }

      await dbConnect();
      const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!updatedCategory) {
          return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ success: true, message: 'Category updated successfully', data: updatedCategory }), { status: 200 });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}


export async function DELETE(req) {
  try {
      const { id } = await req.json();

      if (!id) {
          return new Response(JSON.stringify({ success: false, message: 'Category ID is required' }), { status: 400 });
      }

      await dbConnect();
      const deletedCategory = await CategoryModel.findByIdAndDelete(id);
      if (!deletedCategory) {
          return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ success: true, message: 'Category deleted successfully' }), { status: 200 });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}


