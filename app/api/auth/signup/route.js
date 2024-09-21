// import dbConnect from '../../../lib/dbConnect';
// import User from '../../../models/user';    
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//   await dbConnect();

//   const { email, password, role } = await req.json();

//   // Check if user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 });
//   }

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Create a new user document
//   const newUser = new User({
//     email,
//     password: hashedPassword,
//     role: role || 'sub-admin', // Assign 'sub-admin' role by default if not provided
//   });

//   // Save the user to the database
//   await newUser.save();

//   return new Response(JSON.stringify({ message: 'User created successfully' }), {
//     status: 201,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }


// app/api/signup/route.js
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import User from '@/app/models/user';


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
        role: role || 'user'  // Default to 'user' if no role is provided
      });
      await newUser.save();
  
      return new Response(JSON.stringify({ message: 'User created successfully' }), {
        status: 201,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error creating user', error }), {
        status: 500,
      });
    }
}
