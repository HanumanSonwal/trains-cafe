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
//         const Trainnumber = req.nextUrl.searchParams.get("trainnumber"); // Get trainnumber from query params
//         console.log("Train Number: ", req.nextUrl.searchParams.get("trainnumber"));

//         if (!slug && !Trainnumber) {
//             return NextResponse.json(
//                 { message: "Web station page not found" },
//                 { status: 404 }
//             );
//         }
//         console.log("Train Number: ", Trainnumber);

//         await dbConnect();

//         const result = await WebTrain.find({
//             $or: [
//                 { slug: slug },
//                 { trainnumber: Trainnumber  } 
//             ],
//             status: "published",
//         });
//         console.log("Result: ", result);
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
        const { slug } = context.params; // The dynamic parameter from the URL

        // Split the slug to extract the train number at the end
        const parts = slug.split('-'); // This will split based on '-'
        const trainnumber = parts[parts.length - 1]; // The last part will be the train number

        // If the trainnumber is not valid or not found, return an error
        if (!trainnumber || isNaN(trainnumber)) {
            return NextResponse.json({
                message: 'Invalid or missing trainnumber',
            }, { status: 400 });
        }

        // Extract the rest of the parts as the actual slug
        const slugText = parts.slice(0, -1).join('-');

        await dbConnect();

        // Build the query based on the available parameters
        const query = { status: 'published', trainnumber: trainnumber };

        // Log the query for debugging
        console.log("Query being executed: ", query);

        // Search for the document with the provided trainnumber and slug
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
