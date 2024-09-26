import dbConnect from '@/app/lib/dbConnect';
import VendorModel from '@/app/models/vendor';

export async function GET(req) {
    try {
        await dbConnect();
        const vendors = await VendorModel.find({});
        return new Response(JSON.stringify({ success: true, data: vendors }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: 'Error fetching vendors' }), { status: 500 });
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
        const updateData = await req.json(); 

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
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}
