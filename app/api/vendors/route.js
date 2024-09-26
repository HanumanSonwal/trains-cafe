// app/api/users/route.js
import dbConnect from '../../lib/dbConnect';
import VendorModel from '../../models/vendor';
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
      const vendor = await VendorModel.find({});
      return new Response(JSON.stringify(vendor), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error fetching menu' }), { status: 500 });
    }
}

export async function POST(req, res) {
    try {
      const body = await req.json();

      await dbConnect();
      const newVendor = new VendorModel(body);
      await newVendor.save();
      return new Response(JSON.stringify(newVendor), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
