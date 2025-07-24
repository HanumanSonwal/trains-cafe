import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        const { id } = params; 
        const { status } = await req.json(); 

        if (!status) {
            return NextResponse.json({ success: false, message: "Order status is required" }, { status: 400 });
        }

        await dbConnect();

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true } 
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
