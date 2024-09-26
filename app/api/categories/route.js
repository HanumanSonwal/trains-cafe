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

export async function GET(req, res) {
    try {
      await dbConnect();
      const categories = await CategoryModel.find({});
      return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error fetching categories' }), { status: 500 });
    }
}

export async function POST(req, res) {
    try {
      const body = await req.json();

      await dbConnect();
      const newCategory = new CategoryModel(body);
      await newCategory.save();
      return new Response(JSON.stringify(newCategory), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
