import { NextResponse } from "next/server";
import Coupon from "@/app/models/coupon";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req, context) {
    try {
        const { id } = context.params;

        if(!id) {
            return NextResponse.json({
                success: false,
                message: "Coupon id is required"
            })
        }

        await dbConnect();


        const coupon = await Coupon.findById({
            _id: new mongoose.Types.ObjectId(id)
        });

        if(!coupon) {
            return NextResponse.json({
                success: false,
                message: "Coupon not found"
            })
        }

        return NextResponse.json({
            success: true,
            coupon
        })


    } catch (error) {
        
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}