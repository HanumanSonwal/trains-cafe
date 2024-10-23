import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/app/models/coupon"
import { NextResponse } from "next/server";

export async function POST(req, context) {
 try {
     const { code, title, startDate, endDate, discount, status, maximumAmount } = await req.json();
     
     if (!code || !title || !startDate || !endDate || !discount || !status || !maximumAmount) {
         return NextResponse.json({
                success: false,
                message: "All fields are required"
        })
     }

     await dbConnect();


        const coupon = new Coupon({
            code,
            title,
            startDate,
            endDate,
            discount,
            status,
            maximumAmount
        });
     
     await coupon.save();
     
        return NextResponse.json({
            success: true,
            message: "Coupon added successfully"
        })
 } catch (error) {
     
        return NextResponse.json({
            success: false,
            message: error.message
        })
    
 }
}