import dbConnect from '@/app/lib/dbConnect';
//import StationModel from '@/app/models/vendor';



// export async function GET(req) {
//     try {
//         await dbConnect();
//         const vendors = await StationModel.find({});
//         return new Response(JSON.stringify({ success: true, data: vendors }), { status: 200 });
//     } catch (error) {
//         return new Response(JSON.stringify({ success: false, message: 'Error fetching vendors' }), { status: 500 });
//     }
// }

// import dbConnect from '@/app/lib/dbConnect';
// import StationModel from '@/app/models/station';

// // export async function GET(req) {
// //     try {
// //         const url = new URL(req.url);
// //         const search = url.searchParams.get('search') || '';
        
// //         const page = parseInt(url.searchParams.get('page'), 10) || 1;
// //         const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

// //         await dbConnect();

// //         // Create search criteria
// //         const searchCriteria = search ? {
// //             $or: [
// //                 { name: { $regex: search, $options: 'i' } },
// //                 { code: { $regex: search, $options: 'i' } }
// //             ]
// //         } : {};

// //         // Calculate pagination
// //         const skip = (page - 1) * limit;

// //         const stations = await StationModel.find(searchCriteria)
// //             .limit(limit)
// //             .skip(skip);

// //         const total = await StationModel.countDocuments(searchCriteria);

// //         return new Response(
// //             JSON.stringify({
// //                 success: true,
// //                 data: stations,
// //                 total,
// //                 page,
// //                 totalPages: Math.ceil(total / limit)
// //             }),
// //             { status: 200 }
// //         );
// //     } catch (error) {
// //         return new Response(
// //             JSON.stringify({ success: false, message: 'Error fetching vendors' }),
// //             { status: 500 }
// //         );
// //     }
// // }
// export async function GET(req) {
//     try {
//         const url = new URL(req.url);
//         const search = url.searchParams.get('search') || '';
        
//         const page = parseInt(url.searchParams.get('page'), 10) ;
//         const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

//         await dbConnect();

//         // Create search criteria
//         const searchCriteria = search ? {
//             $or: [
//                 { name: { $regex: search, $options: 'i' } },
//                 { code: { $regex: search, $options: 'i' } }
//             ]
//         } : {};

//         let stations;
//         let total;

//         if (page === 0) {
//             // Fetch all data without pagination
//             stations = await StationModel.find(searchCriteria);
//             total = stations.length; // Total records when fetching all
//         } else {
//             // Calculate pagination
//             const skip = (page - 1) * limit;

//             stations = await StationModel.find(searchCriteria)
//                 .limit(limit)
//                 .skip(skip);
                
//             total = await StationModel.countDocuments(searchCriteria);
//         }

//         console.log('Search Criteria:', searchCriteria);
//         console.log('Stations Retrieved:', stations.length);

//         return new Response(
//             JSON.stringify({
//                 success: true,
//                 data: stations,
//                 total,
//                 page,
//                 totalPages: page === 0 ? 1 : Math.ceil(total / limit)
//             }),
//             { status: 200 }
//         );
//     } catch (error) {
//         return new Response(
//             JSON.stringify({ success: false, message: 'Error fetching vendors' }),
//             { status: 500 }
//         );
//     }
// }


//import WebStation from "@/models/webStation";
import WebStation from "@/app/models/webStation";
 import StationModel from "@/app/models/station";
// import WebStation from "@/models/webStation";
// import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page'), 10);
        const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

        await dbConnect();

        const searchCriteria = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ]
        } : {};

        let stations;
        let total;

        if (page === 0) {
            stations = await StationModel.find(searchCriteria);
            total = stations.length;
        } else {
            const skip = (page - 1) * limit;
            stations = await StationModel.find(searchCriteria).limit(limit).skip(skip);
            total = await StationModel.countDocuments(searchCriteria);
        }

        const stationIds = stations.map(station => station._id);
        const webStations = await WebStation.find(
            { Station: { $in: stationIds } },
            'Station slug'
        );

        const slugMap = {};
        webStations.forEach(ws => {
            slugMap[ws.Station.toString()] = ws.slug;
        });

        const stationsWithSlugs = stations.map(station => ({
            ...station.toObject(),
            slug: slugMap[station._id.toString()] || null
        }));

        return new Response(
            JSON.stringify({
                success: true,
                data: stationsWithSlugs,
                total,
                page,
                totalPages: page === 0 ? 1 : Math.ceil(total / limit)
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching stations:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching stations' }),
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body);
        if (!body.name || !body.code || !body.location || !body.address) {
            return new Response(JSON.stringify({ success: false, message: 'All required fields must be filled' }), { status: 400 });
        }
        await dbConnect();
        const newStation = new StationModel(body);
        await newStation.save();
        return new Response(JSON.stringify({ success: true, message: 'Station added successfully', data: newStation }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}


export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const updateData = await req.json(); // Get JSON data directly from the request body

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: 'Station ID is required' }), { status: 400 });
        }

        await dbConnect();
        const updatedStation = await StationModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedStation) {
            return new Response(JSON.stringify({ success: false, message: 'Station not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Station updated successfully', data: updatedStation }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}
