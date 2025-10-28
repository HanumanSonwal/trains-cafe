// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function GET() {
//   try {
//     const { folders } = await cloudinary.api.sub_folders("trains-cafe");

//     return NextResponse.json({
//       success: true,
//       folders: folders.map(f => f.name),
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ success: false, message: err.message });
//   }
// }



import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const revalidate = 0; // 🚫 Next.js cache disable

export async function GET() {
  try {
    const { folders } = await cloudinary.api.sub_folders("trains-cafe");

    return NextResponse.json(
      {
        success: true,
        folders: folders.map((f) => f.name),
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, must-revalidate" }, // 🚫 browser/server cache
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
