// app/api/users/route.js
import dbConnect from '../../lib/dbConnect';
import MenuModel from '../../models/menu';
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
      const menu = await MenuModel.find({});
      return new Response(JSON.stringify(menu), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error fetching menu' }), { status: 500 });
    }
}

export async function POST(req, res) {
    try {
      const body = await req.json();

      await dbConnect();
      const newMenu = new MenuModel(body);
      await newMenu.save();
      return new Response(JSON.stringify(newMenu), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
