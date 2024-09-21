import {NextResponse} from "next/server";
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import crypto from 'crypto';
import path from 'path';

const pump = promisify(pipeline);

export async function POST(req,res) {
    try{
        const formData = await req.formData();
        const file = formData.getAll('file')[0];
        console.log(formData);
        const imageName = file.name;
        
        const extension = path.extname(file.name); // Get the file extension
        
        // Generate a unique name for the file
        const uniqueName = crypto.randomBytes(16).toString('hex') + extension;
        const filePath = `./public/uploads/${uniqueName}`;
        const url = `${process.env.NEXT_PUBLIC_URL}/uploads/${uniqueName}`;
        await pump(file.stream(), fs.createWriteStream(filePath));
        return NextResponse.json({success: true, name: imageName, url})
    }
    catch (error) {
        return  NextResponse.json({success: false, message: error.message})
    }
}
