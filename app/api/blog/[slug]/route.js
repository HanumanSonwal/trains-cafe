import dbConnect from '@/app/lib/dbConnect';
import Blog from '@/app/models/blog';
import { NextResponse } from 'next/server';
import slugify from 'slugify';




export async function GET(req, context) {
    try {
        const { slug } = context.params;

        if(!slug) {
            return NextResponse.json({
                message: 'Web page not found',
            }, { status: 404 });
        }

        await dbConnect();

        const result = await Blog.findOne({ slug, status: 'published' });

        if (!result) {
            return NextResponse.json({
                message: 'Web page not found',
            }, { status: 404 });
        }

        return NextResponse.json(result)

        
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}