// import { NextResponse } from "next/server";
// import WebStation from "@/app/models/webStation";
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

//         const result = await WebStation.findOne({ slug, status: 'published' });
//         const stations = await StationModel.findById(id).populate('Station');


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

import { NextResponse } from "next/server";
import WebStation from "@/app/models/webStation";
import StationModel from "@/app/models/station"; // Add this import if it's not already there
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req, context) {
    try {
        const { slug } = context.params;

        if (!slug) {
            return NextResponse.json({
                message: 'Web station page not found',
            }, { status: 404 });
        }

        await dbConnect();

        const result = await WebStation.findOne({ slug, status: 'published' });

        if (!result) {
            return NextResponse.json({
                message: 'Web station not found',
            }, { status: 404 });
        }

        const stationDetails = await StationModel.findById(result.Station); // <- corrected usage

        return NextResponse.json({
            ...result.toObject(), // convert Mongoose document to plain JS object
            StationDetails: stationDetails || null // include related station info
        });

    } catch (error) {
        return NextResponse.json({
            message: 'An error occurred',
            error: error.message,
        }, { status: 500 });
    }
}
