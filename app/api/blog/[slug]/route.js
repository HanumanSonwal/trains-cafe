// import dbConnect from '@/app/lib/dbConnect';
// import Blog from '@/app/models/blog';
// import { NextResponse } from 'next/server';

// export async function GET(req, { params }) {
//     try {
//         const { slug } = params;

//         console.log(slug,"slugrrr")

//         if (!slug) {
//             return NextResponse.json({
//                 message: 'Slug parameter is missing',
//             }, { status: 400 });
//         }

//         await dbConnect();

//         const result = await Blog.findOne({ slug, status: 'published' });
        
//         if (!result) {
//             return NextResponse.json({
//                 message: 'Web page not found',
//             }, { status: 404 });
//         }

//         return NextResponse.json(result);

//     } catch (error) {
//         console.error('Error fetching blog:', error);
//         return NextResponse.json({
//             message: 'An error occurred',
//             error: error.message,
//         }, { status: 500 });
//     }
// }


import dbConnect from '@/app/lib/dbConnect';
import Blog from '@/app/models/blog';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        // Extract slug from the route parameters
        const { slug } = params;

        // Log received slug for debugging
        console.log('Received slug:', slug);

        // Validate if slug exists
        if (!slug) {
            return NextResponse.json(
                { message: 'Slug parameter is missing' },
                { status: 400 }
            );
        }

        // Connect to the database
        await dbConnect();
        console.log('Connected to the database');

        // Fetch the blog post from the database
        const result = await Blog.findOne({ slug, status: 'published' });
        console.log('Query result:', result);

        // If the blog post is not found, return a 404 response
        if (!result) {
            return NextResponse.json(
                { message: 'Web page not found' },
                { status: 404 }
            );
        }

        // Return the blog post as a JSON response
        return NextResponse.json(result);
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching blog:', error);

        // Return a 500 response with the error details
        return NextResponse.json(
            {
                message: 'An error occurred',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
