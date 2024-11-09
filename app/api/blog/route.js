// api/blog.js

import dbConnect from '@/app/lib/dbConnect';
import Blog from '@/app/models/blog';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(req) { 
    try {
        await dbConnect();

        const { title, description, image, content, metakeyword, metatitle, metadescription, status } = await req.json();

        // Validate that status is either "publish" or "draft"
        if (!status || !['publish', 'draft'].includes(status)) {
            return NextResponse.json({
                message: 'Status is required and must be either "publish" or "draft".',
            }, { status: 400 });
        }

        const slug = slugify(title, { lower: true, strict: true });
        
        const blog = new Blog({
            slug,
            title,
            description,
            image,
            content,
            metakeyword,
            metatitle,
            metadescription,
            status
        });
        console.log('New blog request:', blog);

        const result = await blog.save();

        return NextResponse.json({
            message: 'Blog added successfully',
            data: { result },
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page"), 10) || 1;
        const limit = parseInt(searchParams.get("limit"), 10) || 10;
        const status = searchParams.get("status"); // Retrieve the status parameter

        // Check if status is provided and only accept 'publish' or 'draft' values
        const filter = status ? { status: status === 'publish' ? 'publish' : 'draft' } : {};

        const options = {
           page,
           limit,
           sort: { createdAt: -1 }, 
        };

        // Execute paginated query with filtering
        const result = await Blog.paginate(filter, options);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();

        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({
                message: 'Blog ID is required',
            }, { status: 400 });
        }

        const result = await Blog.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                message: 'Blog not found or already deleted',
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Blog deleted successfully',
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}

// export async function PUT(req) {
//     try {
//         await dbConnect();

//         const id = req.nextUrl.searchParams.get('id');
//         if (!id) {
//             return NextResponse.json({
//                 message: 'Blog ID is required',
//             }, { status: 400 });
//         }

//         const {
//             name, title, description, keywords, pageData,
//             image, content, metakeyword, metatitle, metadescription, status
//         } = await req.json();

//         // Validate status for PUT method
//         if (!status || !['publish', 'draft'].includes(status)) {
//             return NextResponse.json({
//                 message: 'Status is required and must be either "publish" or "draft".',
//             }, { status: 400 });
//         }

//         const slug = slugify(title, { lower: true, strict: true });

//         const blog = await Blog.findByIdAndUpdate(
//             id,
//             {
//                 name, title, slug, description, keywords, pageData,
//                 image, content, metakeyword, metatitle, metadescription, status
//             },
//             { new: true } // Return the updated document
//         );


//         if (!blog) {
//             return NextResponse.json({
//                 message: 'Blog not found',
//             }, { status: 404 });
//         }

//         return NextResponse.json({
//             message: 'Blog updated successfully',
//             data: { blog },
//         });

//     } catch (error) {
//         return NextResponse.json({
//             message: 'An error occurred',
//             error: error.message,
//         }, { status: 500 });
//     }
// }

export async function PUT(req) {
    try {
        await dbConnect();

        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({
                message: 'Blog ID is required',
            }, { status: 400 });
        }

        const {
            name, title, description, keywords, pageData,
            image, content, metakeyword, metatitle, metadescription, status
        } = await req.json();

        // Validate status for PUT method
        if (status && !['publish', 'draft'].includes(status)) {
            return NextResponse.json({
                message: 'Status must be either "publish" or "draft" if provided.',
            }, { status: 400 });
        }

        // Prepare update fields dynamically
        const updateFields = {};
        if (name) updateFields.name = name;
        if (title) updateFields.title = title;
        if (title) updateFields.slug = slugify(title, { lower: true, strict: true });
        if (description) updateFields.description = description;
        if (keywords) updateFields.keywords = keywords;
        if (pageData) updateFields.pageData = pageData;
        if (image) updateFields.image = image;
        if (content) updateFields.content = content;
        if (metakeyword) updateFields.metakeyword = metakeyword;
        if (metatitle) updateFields.metatitle = metatitle;
        if (metadescription) updateFields.metadescription = metadescription;
        if (status) updateFields.status = status;

        const blog = await Blog.findByIdAndUpdate(
            id,
            updateFields,
            { new: true } // Return the updated document
        );

        if (!blog) {
            return NextResponse.json({
                message: 'Blog not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Blog updated successfully',
            data: { blog },
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}
