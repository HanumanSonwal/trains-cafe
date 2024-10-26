import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const status = searchParams.get("status") || "processing";

        await dbConnect();

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 },
        };

        const searchOptions = {}

        if (status == "processing") {
            searchOptions.$in = ["processing", "pending"]
        } else {
            searchOptions.status = status
        }

        const orders = await Order.paginate(searchOptions, options);
        
        if (!orders || orders.docs.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Orders not found"
            })
        }
        return NextResponse.json({
            success: true,
            ...orders
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}