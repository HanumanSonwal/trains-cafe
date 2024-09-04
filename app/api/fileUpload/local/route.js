import { deleteOne } from '@/app/middleware/function';
import { parseForm } from '@/app/utils/parseForm';

// export async function handler(req, res) {
//   if (await requireRole(req, res, 'ADMIN')) {
//     // Your protected logic here
//     res.status(200).json({ message: 'Welcome Admin' });
//   }
// }
export async function POST(req, res) {

  try {
    const result = await parseForm(req);
    const imageName = result.file.file.newFilename;
    const url = `${process.env.NEXT_PUBLIC_URL}/${imageName}`;
    return new Response({ success: true, name: imageName, url }, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function DELETE(req, res) {

  try {
    const { query } = req;
    await deleteOne(query.name);
    return new Response({ success: true}, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
