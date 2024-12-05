
import dbConnect from '@/app/lib/dbConnect';
import VendorModel from '@/app/models/vendorregistration';
import StationModel from '@/app/models/station';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const search = (url.searchParams.get('search') || '').trim(); // Extract search term
        const stationname = url.searchParams.get('stationname');
        const stationcode = url.searchParams.get('stationcode'); // New search by station code
        const vendorname = url.searchParams.get('vendorname');
        const page = parseInt(url.searchParams.get('page'), 10) || 1;
        const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

        console.log(`Search: ${search}, StationName: ${stationname}, StationCode: ${stationcode}, VendorName: ${vendorname}, Page: ${page}, Limit: ${limit}`);

        await dbConnect();

        // Create search criteria
        let searchCriteria = { $or: [] };

        // General search term
        if (search) {
            // Search for stations by name or code using regex
            const stations = await StationModel.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } } // Search by station code
                ]
            });

            if (stations.length > 0) {
                const stationIds = stations.map(station => new mongoose.Types.ObjectId(station._id));
                searchCriteria.$or.push({ Station: { $in: stationIds } });
            }

            // Fuzzy match for Vendor_Name
            searchCriteria.$or.push({ Vendor_Name: { $regex: search, $options: 'i' } });
        }

        // Search by station name
        if (stationname) {
            const station = await StationModel.findOne({ name: { $regex: stationname, $options: 'i' } });
            if (station) {
                searchCriteria.$or.push({ Station: new mongoose.Types.ObjectId(station._id) });
            }
        }

        // Search by station code
        if (stationcode) {
            const station = await StationModel.findOne({ code: { $regex: stationcode, $options: 'i' } });
            if (station) {
                searchCriteria.$or.push({ Station: new mongoose.Types.ObjectId(station._id) });
            }
        }

        // Search by vendor name
        if (vendorname) {
            searchCriteria.$or.push({ Vendor_Name: { $regex: vendorname, $options: 'i' } });
        }

        // Calculate pagination
        const skip = Math.max((page - 1) * limit, 0);
        console.log('Skip:', skip);

        let vendors;
        if (searchCriteria.$or.length === 0) {
            // Return all vendors if no search criteria
            vendors = await VendorModel.find({})
                .skip(skip)
                .limit(limit)
                .populate('Station', 'name code');
        } else {
            // Apply search criteria
            vendors = await VendorModel.find(searchCriteria)
                .skip(skip)
                .limit(limit)
                .populate('Station', 'name code');
        }

        console.log('Vendors:', vendors);

        if (vendors.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'No items found for the search criteria',
                }),
                { status: 404 }
            );
        }

        // Map the response
        vendors = vendors.map(item => ({
            ...item.toObject(),
            Station: item.Station?._id || 'Unknown',
            Station_Name: item.Station?.name || 'Unknown',
            Station_Code: item.Station?.code || 'Unknown', // Include station code
        }));

        // Get total number of matching documents for pagination
        const total = await VendorModel.countDocuments(searchCriteria.$or.length === 0 ? {} : searchCriteria);
        console.log('Total Count:', total);

        return new Response(
            JSON.stringify({
                success: true,
                data: vendors,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching vendors' }),
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const body = await req.json();
        if (!body.Vendor_Name || !body.Restaurant_Name || !body.Contact_No || !body.Station || !body.Email || !body.Distance ) {
            return new Response(JSON.stringify({ success: false, message: 'All required fields must be filled' }), { status: 400 });
        }
        await dbConnect();
        const newVendor = new VendorModel(body);
        await newVendor.save();
        return new Response(JSON.stringify({ success: true, message: 'Vendor added successfully', data: newVendor }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}


// export async function PUT(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get('id');
//         const updateData = await req.json(); 

//         if (!id) {
//             return new Response(JSON.stringify({ success: false, message: 'Vendor ID is required' }), { status: 400 });
//         }

//         await dbConnect();
//         const updatedVendor = await VendorModel.findByIdAndUpdate(id, updateData, { new: true });
        
//         if (!updatedVendor) {
//             return new Response(JSON.stringify({ success: false, message: 'Vendor not found' }), { status: 404 });
//         }

//         return new Response(JSON.stringify({ success: true, message: 'Vendor updated successfully', data: updatedVendor }), { status: 200 });
//     } catch (error) {
//         return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
//     }
// }


// export async function DELETE(req) {
//     try {
//         const { id } = await req.json();

//         if (!id) {
//             return new Response(JSON.stringify({ success: false, message: 'Vendor ID is required' }), { status: 400 });
//         }

//         await dbConnect();
        
//         const deletedVendor = await VendorModel.findByIdAndDelete(id);
        
//         if (!deletedVendor) {
//             return new Response(JSON.stringify({ success: false, message: 'Vendor not found' }), { status: 404 });
//         }

//         return new Response(JSON.stringify({ success: true, message: 'Vendor deleted successfully' }), { status: 200 });
//     } catch (error) {
//         return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
//     }
// }
