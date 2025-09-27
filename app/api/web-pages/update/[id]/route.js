import dbConnect from "@/app/lib/dbConnect";
import WebPage from "@/app/models/webPage";
import slugify from "slugify";

const { NextResponse } = require("next/server");

export async function PUT(req, context) {
    
    try {

        await dbConnect();


        const { id } = context.params;

        const { name, title, description, keywords, pageData, status } = await req.json();

const slug = slugify(name, { lower: true, strict: true });


        const webPage = await WebPage.findById(id);
        if (!webPage) {
            return NextResponse.json({
                message: 'Web page not found',
            }, { status: 404 });
        }
      
        webPage.name = name;
        webPage.title = title;
        webPage.slug = slug;
        webPage.description = description;
        webPage.keywords = keywords;
        webPage.pageData = pageData;
        webPage.status = status;
        
        await webPage.save();
      
        return NextResponse.json({
            message: 'Web page updated successfully',
            data: { webPage },
        });
    }
    catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}