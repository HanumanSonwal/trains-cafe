import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/app/models/coupon";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req, context) { 
    try {
        const {
            code,
            title,
            startDate,
            endDate,
            discount,
            status, 
            maximumAmount
        } = await req.json();

        const { id } = context.params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Coupon id is required"
            });
        }

        if (!code || !title || !startDate || !endDate || !discount || !status || !maximumAmount) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            });
        }

        await dbConnect();


        const coupon = await Coupon.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
            code,
            title,
            startDate,
            endDate,
            discount,
            status,
            maximumAmount
        });

        if (!coupon) {
            return NextResponse.json({
                success: false,
                message: "Coupon not found"
            });
        }

        return NextResponse.json({
            success: true,
            message: "Coupon updated successfully"
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message  
        })
    }
}
 