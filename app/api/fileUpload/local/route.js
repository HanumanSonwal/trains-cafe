// import {NextResponse} from "next/server";
// import fs from 'fs';
// import { pipeline } from 'stream';
// import { promisify } from 'util';
// import crypto from 'crypto';
// import path from 'path';

// const pump = promisify(pipeline);

// export async function POST(req,res) {
//     try{
//         const formData = await req.formData();
//         const file = formData.getAll('file')[0];
//         console.log(formData);
//         const imageName = file.name;
        
//         const extension = path.extname(file.name); // Get the file extension
        
//         // Generate a unique name for the file
//         const uniqueName = crypto.randomBytes(16).toString('hex') + extension;
//         const filePath = `./public/uploads/${uniqueName}`;
//         const url = `${process.env.NEXT_PUBLIC_URL}/uploads/${uniqueName}`;
//         await pump(file.stream(), fs.createWriteStream(filePath));
//         return NextResponse.json({success: true, name: imageName, url})
//     }
//     catch (error) {
//         return  NextResponse.json({success: false, message: error.message})
//     }
// }
import { NextResponse } from "next/server";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import crypto from 'crypto';
import path from 'path';

const pump = promisify(pipeline);

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.getAll('file')[0];

        const extension = path.extname(file.name); // Get the file extension
        
        // Generate a unique name for the file
        const uniqueName = crypto.randomBytes(16).toString('hex') + extension;
        
        // Define the uploads directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Ensure the directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, uniqueName); // Path to save the file
        
        // Dynamic URL generation based on environment
        const baseURL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const url = `${baseURL}/uploads/${uniqueName}`;
        console.log(url, "url");

        // Save the file to the uploads directory
        await pump(file.stream(), fs.createWriteStream(filePath));

        return NextResponse.json({ success: true, name: file.name, url });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
