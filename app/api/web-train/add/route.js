import dbConnect from '@/app/lib/dbConnect';
import WebTrain from "@/app/models/webtrain";
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(req) { 
    try {
            await dbConnect();

        const { name, title, trainname,trainnumber,description, keywords, pageData } = await req.json();

        // const slug = slugify(title, { lower: true, strict: true });
        const slug = slugify(`order-food-in-${trainname}-${trainnumber}`, { lower: true, strict: true });

        
        const webTrain = new WebTrain({
            name,
            slug,
            title,
            trainname,
            trainnumber,
            description,
            keywords,
            pageData,
        });

     const result =  await webTrain.save();

        return NextResponse.json({
            message: 'Web Train added successfully',
            data: { result },
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}