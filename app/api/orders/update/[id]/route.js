// import { NextResponse } from "next/server";


// export async function POST(req, context) {
//     try {
//         const { id } = req.context;

//         if(!id) {
//          NextResponse.json({ message: "Order id is required" }, 400);   
//         }

//     } catch (error) {
        
//     }
// }
import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        const { id } = params; // Get the `id` from the request params
        const { status } = await req.json(); // Parse the `status` from the request body

        // Validate that `status` is provided
        if (!status) {
            return NextResponse.json({ success: false, message: "Order status is required" }, { status: 400 });
        }

        await dbConnect();

        // Find the order by id and update the `status` field
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error updating order status",
            error: error.message
        }, { status: 500 });
    }
}
