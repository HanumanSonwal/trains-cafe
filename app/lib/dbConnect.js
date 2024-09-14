import { connect, set } from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB URI (MONGO_URI) environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    set("strictQuery", true);
    cached.promise = connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}

export default dbConnect;

// import mongoose from 'mongoose';
// let isConnected = false;

// export default async function connectToDatabase() {
//   if (isConnected) {
//     console.log('Already connected to the database');
//     return;
//   }

//   try {
//     const dbURI = process.env.MONGODB_URI;
//     if (!dbURI) {
//       throw new Error('MongoDB URI not found in environment variables');
//     }

//     const db = await mongoose.connect(dbURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     isConnected = db.connections[0].readyState === 1;
//     console.log('Connected to the database');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw new Error('Failed to connect to the database');
//   }
// }
