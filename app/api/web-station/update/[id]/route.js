import dbConnect from "@/app/lib/dbConnect";
import WebStation from "@/app/models/webStation";
import slugify from "slugify";

const { NextResponse } = require("next/server");

export async function PUT(req, context) {
    
    try {

        await dbConnect();

        const { id } = context.params;

        const { name, title, description, keywords, pageData, status } = await req.json();

        const slug = slugify(title, { lower: true, strict: true });

        const webStation = await WebStation.findById(id);
        if (!webStation) {
            return NextResponse.json({
                message: 'Web station not found',
            }, { status: 404 });
        }
      
        webStation.name = name;
        webStation.title = title;
        webStation.slug = slug;
        webStation.description = description;
        webStation.keywords = keywords;
        webStation.pageData = pageData;
        webStation.status = status;
        
        await webStation.save();
      
        return NextResponse.json({
            message: 'Web station updated successfully',
            data: { webStation },
        });
    }
    catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}