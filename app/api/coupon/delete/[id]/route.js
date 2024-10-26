import dbConnect from '@/app/lib/dbConnect';
import Coupon from '@/app/models/coupon'
import { NextResponse } from 'next/server';

export async function DELETE(req, context) {
    try {
        const { id } = context.params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Coupon id is required"
            });
        }

        await dbConnect();

        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return NextResponse.json({
                success: false,
                message: "Coupon not found"
            });
        }

        return NextResponse.json({
            success: true,
            message: "Coupon deleted successfully"
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}

