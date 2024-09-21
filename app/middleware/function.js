import { unlink } from "fs/promises";

export async function deleteOne(file) {
  try {
    const filePath = `./public/uploads/${file}`;
    await unlink(filePath);
  } catch (err) {
    console.log(err);
  }
}
export async function deleteMultiple(files) {
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `./public/uploads/${file}`;
      await unlink(filePath);
    }
  } catch (err) {
    console.log(err);
  }
}
