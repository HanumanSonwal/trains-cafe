export async function POST(req, res) {
    try {
        const result = await parseForm(req);
        const imageName = result.file.file.newFilename;
        const url = `${process.env.NEXT_PUBLIC_URL}/${imageName}`;
        res.status(200).json({ success: true, name: imageName, url });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: err.message });
      }
}