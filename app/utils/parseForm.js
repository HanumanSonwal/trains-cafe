import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
    api: {
      bodyParser: false,
    },
  };

  // Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch (err) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

export async function parseForm(req) {
await ensureUploadDir();
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      uploadDir,
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      const data = { field: fields, file: files };
      resolve(data);
    });
  });
}

export async function parseFormMultiple(req) {
    await ensureUploadDir();
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir,
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      const data = { field: fields, file: files };
      resolve(data);
    });
  });
}
