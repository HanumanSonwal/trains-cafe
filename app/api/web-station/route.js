// const { NextResponse } = require("next/server");
// import dbConnect from "@/app/lib/dbConnect";
// import WebStation from "@/app/models/webStation";


// export async function GET(req) {
//     try {
//         await dbConnect();

//         const { searchParams } = new URL(req.url);
//         const page = searchParams.get("page") || 1;
//         const limit = searchParams.get("limit") || 10;        
        

//     const options = {
//        page: parseInt(page, 10),
//        limit: parseInt(limit, 10),
//        sort: { createdAt: -1 }, 
//      };

//      const result = await WebStation.paginate({}, options);

//    return NextResponse.json(
//         result
//    );
//     } catch (error) {
//         return NextResponse.json({
//             message: 'An error occurred',
//             error: error.message,
//         }, { status: 500 });
        
//     }


// }
const { NextResponse } = require("next/server");
import dbConnect from "@/app/lib/dbConnect";
import WebStation from "@/app/models/webStation";
import mongoose from "mongoose"; // Import mongoose to check ObjectId validity

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const search = searchParams.get("search") || ''; // Added search parameter

        // Set options for pagination
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 },
        };

        // Build the query based on the search parameter
        let query = {};

        // If 'search' is provided, check if it's a valid ObjectId and filter accordingly
        if (search) {
            if (mongoose.Types.ObjectId.isValid(search)) {
                // If search is a valid ObjectId, filter by 'Station' using ObjectId
                query.Station = new mongoose.Types.ObjectId(search);
            } else {
                // If search is not a valid ObjectId, perform other filters (e.g., on title, slug, etc.)
                query.$or = [
                    { slug: { $regex: search, $options: "i" } }, // Search by Station (if Station is a string)
                    // You can add more fields to search by here
                ];
            }
        }

        // Perform the query with pagination
        const result = await WebStation.paginate(query, options);

        // Return the result as JSON
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                message: 'An error occurred',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
