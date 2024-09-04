import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';    
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();

  const { email, password, role } = await req.json();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user document
  const newUser = new User({
    email,
    password: hashedPassword,
    role: role || 'sub-admin', // Assign 'sub-admin' role by default if not provided
  });

  // Save the user to the database
  await newUser.save();

  return new Response(JSON.stringify({ message: 'User created successfully' }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

