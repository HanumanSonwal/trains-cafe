import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getDirectFolders() {
  const { folders } = await cloudinary.api.sub_folders("trains-cafe");
  return folders.map(f => f.path);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  const search = searchParams.get("search")?.trim() || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    let folders = [];

    if (folder) {
      folders = [`trains-cafe/${folder}`];
    } else {
      folders = await getDirectFolders();
    }

    let allImages = [];

    for (const f of folders) {
      let expression = `folder:${f}`;
      if (search) {
        expression += ` AND filename:*${search}*`;
      }

      const res = await cloudinary.search
        .expression(expression)
        .sort_by("created_at", "desc")
        .max_results(500) 
        .execute();

      res.resources.forEach(img => {
        let folderName = "";
        if (img.folder && img.folder.startsWith("trains-cafe/")) {
          folderName = img.folder.replace("trains-cafe/", "");
        } else {
          const parts = img.public_id.split("/");
          const idx = parts.indexOf("trains-cafe");
          if (idx >= 0 && parts.length > idx + 1) {
            folderName = parts[idx + 1];
          }
        }

        allImages.push({
          public_id: img.public_id,
          url: img.secure_url,
          folder: folderName,
          name: img.filename,
        });
      });
    }

    const startIndex = (page - 1) * limit;
    const paginatedImages = allImages.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total: allImages.length,
      images: paginatedImages,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
