import dbConnect from '@/app/lib/dbConnect';
import WebPage from '@/app/models/webPage';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(req) { 
    try {
            await dbConnect();

        const { name, title, description, keywords, pageData } = await req.json();

    const slug = slugify(name, { lower: true, strict: true });
        if (!name || !title) {
            return NextResponse.json({
                message: 'Name and Title are required',
            }, { status: 400 });
        }
        
        
        const webPage = new WebPage({
            name,
            slug,
            title,
            description,
            keywords,
            pageData,
        });

     const result =  await webPage.save();

        return NextResponse.json({
            message: 'Web page added successfully',
            data: { result },
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}