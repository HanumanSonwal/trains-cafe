// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import { writeFile } from "fs/promises";
// import path from "path";
// import os from "os";
// import formidable from "formidable";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Next.js API route config: bodyParser false because we use formidable
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req) {
//   const form = formidable();

//   return new Promise((resolve, reject) => {
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return reject(
//           NextResponse.json({ success: false, message: err.message })
//         );
//       }

//       // ✅ Get folder name
//       const folderName = fields.folder?.[0]?.trim();

//       if (!folderName) {
//         return resolve(
//           NextResponse.json({ success: false, message: "Folder name required" })
//         );
//       }

//       // ✅ Final upload path: always inside trains-cafe
//       const uploadFolder = `trains-cafe/${folderName}`;

//       // ✅ Support multiple files or single
//       const fileArray = Array.isArray(files.files)
//         ? files.files
//         : [files.files];

//       try {
//         for (const file of fileArray) {
//           // Some versions of formidable already give a `filepath`, otherwise use buffer
//           let filePath = file.filepath;
//           if (!filePath) {
//             const bytes = await file.toBuffer();
//             filePath = path.join(os.tmpdir(), file.originalFilename);
//             await writeFile(filePath, bytes);
//           }

//           // ✅ Upload to Cloudinary inside correct folder
//           await cloudinary.uploader.upload(filePath, {
//             folder: uploadFolder,
//           });
//         }

//         resolve(
//           NextResponse.json({
//             success: true,
//             message: `Uploaded to ${uploadFolder}`,
//           })
//         );
//       } catch (error) {
//         console.error(error);
//         reject(
//           NextResponse.json({ success: false, message: error.message })
//         );
//       }
//     });
//   });
// }


import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = formidable();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(
          NextResponse.json({ success: false, message: err.message })
        );
      }

      const folderName = fields.folder?.[0]?.trim();
      if (!folderName) {
        return resolve(
          NextResponse.json({ success: false, message: "Folder name required" })
        );
      }

      const uploadFolder = `trains-cafe/${folderName}`;
      const fileArray = Array.isArray(files.files) ? files.files : [files.files];

      try {
        await Promise.all(
          fileArray.map((file) => {
            return new Promise((res, rej) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: uploadFolder },
                (error, result) => {
                  if (error) return rej(error);
                  res(result);
                }
              );

              const fileStream = Readable.toWeb(file.toReadable());
              fileStream.pipe(uploadStream);
            });
          })
        );

        resolve(
          NextResponse.json({
            success: true,
            message: `Uploaded to ${uploadFolder}`,
          })
        );
      } catch (error) {
        console.error(error);
        reject(
          NextResponse.json({ success: false, message: error.message })
        );
      }
    });
  });
}
