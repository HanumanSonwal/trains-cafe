import dbConnect from '../../../lib/dbConnect';
import User from '@/app/models/user';
import bcrypt from 'bcryptjs';
import { getStaff } from '@/app/lib/sessionPermission';
import { isAdmin } from '@/app/lib/rbac';

// Public sign-up only ever makes a plain customer account. Before this check anyone could
// send { role: "admin" } and give themselves the panel. Panel users are made by an admin
// from Super Panel > Users & Roles (/api/admin/users).
export async function POST(req) {
    try {
      const { name, email, password, role } = await req.json();
      if (!name || !email || !password || String(password).length < 8) {
        return new Response(JSON.stringify({ message: 'Name, email and a password of 8+ characters are required' }), {
          status: 400,
        });
      }
      await dbConnect();

      let finalRole = 'user';
      if (role && role !== 'user') {
        const caller = await getStaff(req);
        if (!isAdmin(caller)) {
          return new Response(JSON.stringify({ message: 'Only an admin can create this kind of account' }), {
            status: 403,
          });
        }
        if (['admin', 'sub-admin'].includes(role)) finalRole = role;
      }

      const normalised = String(email).trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalised });
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'User already exists' }), {
          status: 400,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await new User({ name, email: normalised, password: hashedPassword, role: finalRole }).save();

      return new Response(JSON.stringify({ message: 'User created successfully' }), {
        status: 201,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Could not create the account' }), {
        status: 500,
      });
    }
}
