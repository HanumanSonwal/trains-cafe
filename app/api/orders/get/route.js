import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import station from '@/app/models/station';
import vendor from '@/app/models/vendor';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || 1, 10);
        const limit = parseInt(searchParams.get("limit") || 10, 10);
        const status = searchParams.get("status")?.trim();
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        await dbConnect();

        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
        };

        const searchOptions = {};

        if (status) {
            searchOptions.status = status;
        }

        if (startDate && endDate) {
            searchOptions.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.paginate(searchOptions, options);

        if (!orders || orders.docs.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Orders not found"
            });
        }

        const ordersWithDetails = await Promise.all(
            orders.docs.map(async (order) => {
                const vendorDetails = await vendor.findById(order.vendor).select("Vendor_Name Contact_No");
                const stationDetails = await station.findById(order.station).select("Station_Name Station_Code");

                return {
                    ...order.toObject(),
                    vendorDetails: vendorDetails || null,
                    stationDetails: stationDetails || null,
                };
            })
        );

        return NextResponse.json({
            success: true,
            ...orders,
            docs: ordersWithDetails,
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}
