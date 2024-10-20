// import dbConnect from '@/app/lib/dbConnect';
// import VendorModel from '@/app/models/vendor';

// export async function GET(req) {
//     try {
//         await dbConnect();
//         const vendors = await VendorModel.find({});
//         return new Response(JSON.stringify({ success: true, data: vendors }), { status: 200 });
//     } catch (error) {
//         return new Response(JSON.stringify({ success: false, message: 'Error fetching vendors' }), { status: 500 });
//     }
// }

import dbConnect from '@/app/lib/dbConnect';
import VendorModel from '@/app/models/vendor';

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page'), 10) || 1;
        const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

        await dbConnect();

        // Create search criteria
        const searchCriteria = search ? {
            $or: [
                { Vendor_Name: { $regex: search, $options: 'i' } },
                { Station: { $regex: search, $options: 'i' } }
            ]
        } : {};

        // Calculate pagination
        const skip = (page - 1) * limit;

        const vendors = await VendorModel.find(searchCriteria)
            .skip(skip)
            .limit(limit);

        const total = await VendorModel.countDocuments(searchCriteria);

        return new Response(
            JSON.stringify({
                success: true,
                data: vendors,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching vendors' }),
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const body = await req.json();
        if (!body.Vendor_Name || !body.Contact_No || !body.Station || !body.Delivery_Charges || !body.Min_Order_Value) {
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


export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const updateData = await req.json(); // Get JSON data directly from the request body

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: 'Vendor ID is required' }), { status: 400 });
        }

        await dbConnect();
        const updatedVendor = await VendorModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedVendor) {
            return new Response(JSON.stringify({ success: false, message: 'Vendor not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Vendor updated successfully', data: updatedVendor }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ success: false, message: 'Vendor ID is required' }), { status: 400 });
        }

        await dbConnect();
        
        const deletedVendor = await VendorModel.findByIdAndDelete(id);
        
        if (!deletedVendor) {
            return new Response(JSON.stringify({ success: false, message: 'Vendor not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Vendor deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}
