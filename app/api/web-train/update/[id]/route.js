// import dbConnect from "@/app/lib/dbConnect";
// import WebTrain from "@/app/models/webtrain";
// import slugify from "slugify";

// const { NextResponse } = require("next/server");

// export async function PUT(req, context) {
    
//     try {

//         await dbConnect();

//         const { id } = context.params;

//         const { name, title, description, keywords, pageData, status } = await req.json();

//         const slug = slugify(title, { lower: true, strict: true });

//         const webTrain = await WebTrain.findById(id);
//         if (!webTrain) {
//             return NextResponse.json({
//                 message: 'Web station not found',
//             }, { status: 404 });
//         }
      
//         webTrain.name = name;
//         webTrain.title = title;
//         webTrain.slug = slug;
//         webTrain.description = description;
//         webTrain.keywords = keywords;
//         webTrain.pageData = pageData;
//         webTrain.status = status;
        
//         await webTrain.save();
      
//         return NextResponse.json({
//             message: 'Web station updated successfully',
//             data: { webTrain },
//         });
//     }
//     catch (error) {
//         return NextResponse.json({
//             message: 'An error occurred',
//             error: error.message,
//         }, { status: 500 });
//     }
// }

import dbConnect from "@/app/lib/dbConnect";
import WebTrain from "@/app/models/webtrain";
import slugify from "slugify";

const { NextResponse } = require("next/server");

export async function PUT(req, context) {
    
    try {

        await dbConnect();

        const { id } = context.params;

        // const { name, title, description, keywords, pageData, status } = await req.json();
        const { name, title, trainname,trainnumber,description, keywords, pageData ,status } = await req.json();
        const slug = slugify(`order-food-in-${trainname}-${trainnumber}`, { lower: true, strict: true });
        // const slug = slugify(title, { lower: true, strict: true });

        const webTrain = await WebTrain.findById(id);
        if (!webTrain) {
            return NextResponse.json({
                message: 'Web station not found',
            }, { status: 404 });
        }
      
        webTrain.name = name;
        webTrain.title = title;
        webTrain.slug = slug;
        webTrain.name = trainname; 
         webTrain.name = trainnumber;
        webTrain.description = description;
        webTrain.keywords = keywords;
        webTrain.pageData = pageData;
        webTrain.status = status;
        
        await webTrain.save();
      
        return NextResponse.json({
            message: 'Web station updated successfully',
            data: { webTrain },
        });
    }
    catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}