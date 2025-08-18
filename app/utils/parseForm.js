import formidable from "formidable";

async function bufferRequestBody(req) {
  const buffers = [];
  for await (const chunk of req.body) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers);
}

export async function parseForm(req) {
  
  return new Promise(async (resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      uploadDir: "./public/uploads",
    });

    const bodyBuffer = await bufferRequestBody(req);

    form.headers = {
      'content-length': req.headers.get('content-length'),
      'content-type': req.headers.get('content-type'),
    };

    form.parse(bodyBuffer, (err, fields, files) => {
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
