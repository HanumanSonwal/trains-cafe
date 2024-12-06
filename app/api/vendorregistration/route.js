import dbConnect from '@/app/lib/dbConnect';
import VendorModel from '@/app/models/vendorregistration';
import StationModel from '@/app/models/station';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const search = (url.searchParams.get('search') || '').trim(); // Extract search term
        const stationname = url.searchParams.get('stationname')?.trim();
        const stationcode = url.searchParams.get('stationcode')?.trim();
        const vendorname = url.searchParams.get('vendorname')?.trim();
        const page = parseInt(url.searchParams.get('page'), 10) || 1;
        const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

        console.log(`Search: ${search}, StationName: ${stationname}, StationCode: ${stationcode}, VendorName: ${vendorname}, Page: ${page}, Limit: ${limit}`);

        await dbConnect();

        // Create search criteria
        let searchCriteria = [];

        if (search) {
            const stations = await StationModel.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } }
                ]
            });

            if (stations.length > 0) {
                const stationIds = stations.map(station => station._id);
                searchCriteria.push({ Station: { $in: stationIds } });
            }
            searchCriteria.push({ Vendor_Name: { $regex: search, $options: 'i' } });
        }

        if (stationname) {
            const station = await StationModel.findOne({ name: { $regex: stationname, $options: 'i' } });
            if (station) {
                searchCriteria.push({ Station: station._id });
            }
        }

        if (stationcode) {
            const station = await StationModel.findOne({ code: { $regex: stationcode, $options: 'i' } });
            if (station) {
                searchCriteria.push({ Station: station._id });
            }
        }

        if (vendorname) {
            searchCriteria.push({ Vendor_Name: { $regex: vendorname, $options: 'i' } });
        }

        const skip = (page - 1) * limit;

        const query = searchCriteria.length > 0 ? { $or: searchCriteria } : {};
        const vendors = await VendorModel.find(query)
            .skip(skip)
            .limit(limit)
            .populate('Station', 'name code');

        if (vendors.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'No items found for the search criteria',
                }),
                { status: 404 }
            );
        }

        const mappedVendors = vendors.map(item => ({
            ...item.toObject(),
            Station: item.Station?._id || 'Unknown',
            Station_Name: item.Station?.name || 'Unknown',
            Station_Code: item.Station?.code || 'Unknown',
        }));

        const total = await VendorModel.countDocuments(query);

        return new Response(
            JSON.stringify({
                success: true,
                data: mappedVendors,
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
        if (!body.Vendor_Name || !body.Restaurant_Name || !body.Contact_No || !body.Station || !body.Email || !body.Distance) {
            return new Response(JSON.stringify({ success: false, message: 'All required fields must be filled' }), { status: 400 });
        }

        await dbConnect();
        const newVendor = new VendorModel(body);
        await newVendor.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Vendor added successfully',
                data: newVendor,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding vendor:', error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(
                JSON.stringify({ success: false, message: 'Vendor ID is required' }),
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid Vendor ID' }),
                { status: 400 }
            );
        }

        await dbConnect();
        const deletedVendor = await VendorModel.findByIdAndDelete(id);

        if (!deletedVendor) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Vendor not found',
                }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Vendor deleted successfully',
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting vendor:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error deleting vendor' }),
            { status: 500 }
        );
    }
}

