import { NextResponse } from "next/server";
import { Readable } from "stream";
import crypto from "crypto";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function toNodeReadable(stream) {
  return Readable.from(stream);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderName = formData.get("folderName");

    if (!file) {
      throw new Error("No file found in the request");
    }

    const extension = path.extname(file.name);
    const uniqueName = crypto.randomBytes(16).toString("hex") + extension;

    const fileStream = toNodeReadable(file.stream());

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName || "trains-cafe/uploads",
          public_id: uniqueName,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      fileStream.pipe(uploadStream);
    });

    return NextResponse.json({
      success: true,
      name: file.name,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
