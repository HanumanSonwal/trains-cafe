import dbConnect from '../../../lib/dbConnect';
import User from '@/app/models/user';
import bcrypt from 'bcryptjs';


export async function POST(req) {
    try {
      const { name, email, password, role } = await req.json();
      await dbConnect();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'User already exists' }), {
          status: 400,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user' 
      });
      await newUser.save();
  
      return new Response(JSON.stringify({ message: 'User created successfully' }), {
        status: 201,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message}), {
        status: 500,
      });
    }
}
