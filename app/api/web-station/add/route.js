import dbConnect from '@/app/lib/dbConnect';
import WebStation from "@/app/models/webStation";
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(req) { 
    try {
            await dbConnect();

        const { name, title, description, keywords, pageData } = await req.json();

        const slug = slugify(title, { lower: true, strict: true });
        
        const webStation = new WebStation({
            name,
            slug,
            title,
            description,
            keywords,
            pageData,
        });

     const result =  await webStation.save();

        return NextResponse.json({
            message: 'Web station added successfully',
            data: { result },
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}