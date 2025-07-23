// // import { NextResponse } from "next/server";
// // import { v2 as cloudinary } from "cloudinary";
// // import { writeFile } from "fs/promises";
// // import path from "path";
// // import os from "os";
// // import formidable from "formidable";

// // cloudinary.config({
// //   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// // // ✅ Next.js API route config: bodyParser false because we use formidable
// // export const config = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };

// // export async function POST(req) {
// //   const form = formidable();

// //   return new Promise((resolve, reject) => {
// //     form.parse(req, async (err, fields, files) => {
// //       if (err) {
// //         return reject(
// //           NextResponse.json({ success: false, message: err.message })
// //         );
// //       }

// //       // ✅ Get folder name
// //       const folderName = fields.folder?.[0]?.trim();

// //       if (!folderName) {
// //         return resolve(
// //           NextResponse.json({ success: false, message: "Folder name required" })
// //         );
// //       }

// //       // ✅ Final upload path: always inside trains-cafe
// //       const uploadFolder = `trains-cafe/${folderName}`;

// //       // ✅ Support multiple files or single
// //       const fileArray = Array.isArray(files.files)
// //         ? files.files
// //         : [files.files];

// //       try {
// //         for (const file of fileArray) {
// //           // Some versions of formidable already give a `filepath`, otherwise use buffer
// //           let filePath = file.filepath;
// //           if (!filePath) {
// //             const bytes = await file.toBuffer();
// //             filePath = path.join(os.tmpdir(), file.originalFilename);
// //             await writeFile(filePath, bytes);
// //           }

// //           // ✅ Upload to Cloudinary inside correct folder
// //           await cloudinary.uploader.upload(filePath, {
// //             folder: uploadFolder,
// //           });
// //         }

// //         resolve(
// //           NextResponse.json({
// //             success: true,
// //             message: `Uploaded to ${uploadFolder}`,
// //           })
// //         );
// //       } catch (error) {
// //         console.error(error);
// //         reject(
// //           NextResponse.json({ success: false, message: error.message })
// //         );
// //       }
// //     });
// //   });
// // }

// // G:\Trains cafe\trains-cafe\app\api\fileUpload\bulk\route.js

// // ./app/api/fileUpload/bulk/route.js

// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import formidable from "formidable";
// import { Readable } from "stream";
// import { writeFile } from "fs/promises";
// import path from "path";
// import os from "os";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const dynamic = "force-dynamic";
// export const runtime = "nodejs";
// export const maxDuration = 60;

// async function streamToNodeReadable(webReadable) {
//   const reader = webReadable.getReader();
//   return new Readable({
//     async read() {
//       const { done, value } = await reader.read();
//       if (done) return this.push(null);
//       this.push(Buffer.from(value));
//     },
//   });
// }

// export async function POST(req) {
//   // 👉 Web Request को Node.js stream में convert करो:
//   const nodeReq = await streamToNodeReadable(req.body);

//   const form = formidable({ multiples: true });

//   return new Promise((resolve, reject) => {
//     form.parse(nodeReq, async (err, fields, files) => {
//       if (err) {
//         console.error(err);
//         return reject(NextResponse.json({ success: false, message: err.message }));
//       }

//       const folderName = fields.folder?.[0] || "uploads";
//       const uploadFolder = `trains-cafe/${folderName}`;
//       const fileArray = Array.isArray(files.files) ? files.files : [files.files];

//       try {
//         for (const file of fileArray) {
//           const tempPath = path.join(os.tmpdir(), file.originalFilename);
//           await writeFile(tempPath, await file.toBuffer());
//           await cloudinary.uploader.upload(tempPath, { folder: uploadFolder });
//         }
//         resolve(NextResponse.json({ success: true, message: "Uploaded!" }));
//       } catch (error) {
//         console.error(error);
//         reject(NextResponse.json({ success: false, message: error.message }));
//       }
//     });
//   });
// }

