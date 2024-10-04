import dbConnect from '@/app/lib/dbConnect';
import WebPage from '@/app/models/webPage';
import { NextResponse } from 'next/server';

export async function POST(req) { 
    try {
               await dbConnect();

        const { name, title, description, keywords, pageData } = await req.json();
        
        const webPage = new WebPage({
            name,
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