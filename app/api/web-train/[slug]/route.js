// import { NextResponse } from "next/server";
// import WebTrain from "@/app/models/webtrain";
// import dbConnect from "@/app/lib/dbConnect";

// export async function GET(req, context) {
//     try {
//         const { slug } = context.params;

//         if(!slug) {
//             return NextResponse.json({
//                 message: 'Web station page not found',
//             }, { status: 404 });
//         }

//         await dbConnect();

//         const result = await WebTrain.findOne({ slug, status: 'published' });

//         if (!result) {
//             return NextResponse.json({
//                 message: 'Web station not found',
//             }, { status: 404 });
//         }

//         return NextResponse.json(result)

        
//     } catch (error) {
//         return NextResponse.json({
//             message: 'An error occurred',
//             error: error.message,
//         }, { status: 500 });
//     }
// }


// import { NextResponse } from "next/server";
// import WebTrain from "@/app/models/webtrain";
// import dbConnect from "@/app/lib/dbConnect";

// export async function GET(req, { params }) {
//     try {
//         const { slug } = params;
//         const trainnumber = req.nextUrl.searchParams.get("trainnumber");

//         if (!slug && !trainnumber) {
//             return NextResponse.json(
//                 { message: "Web station page not found" },
//                 { status: 404 }
//             );
//         }

//         await dbConnect();

//         const result = await WebTrain.findOne({
//             $or: [
//                 { slug: slug },
//                 { trainnumber: trainnumber }
//             ],
//             status: "published",
//         });

//         if (!result) {
//             return NextResponse.json(
//                 { message: "Web station not found" },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(result);
//     } catch (error) {
//         return NextResponse.json(
//             { message: "An error occurred", error: error.message },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import WebTrain from "@/app/models/webtrain";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req, context) {
    try {
        const { slug } = context.params; // Dynamic parameter from the URL

        // Train number is directly passed as a slug (assuming it's a number)
        const trainnumber = slug;

        // Check if train number is valid
        if (!trainnumber || isNaN(trainnumber)) {
            return NextResponse.json({
                message: 'Invalid or missing train number',
            }, { status: 400 });
        }

        // Connect to the database
        await dbConnect();

        // Query the database based on the train number
        const query = { status: 'published', trainnumber: trainnumber };

        // Log the query for debugging
        console.log("Query being executed: ", query);

        // Find the document
        const result = await WebTrain.findOne(query);

        if (!result) {
            return NextResponse.json({
                message: 'Web station not found',
            }, { status: 404 });
        }

        return NextResponse.json(result);

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}
