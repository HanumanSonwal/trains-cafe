import Coupon from "@/app/models/coupon"
import { NextResponse } from "next/server";

export async function GET(req) { 
    try { 
        const coupons = await Coupon.find()

        if(!coupons || coupons.length === 0) { 
            return NextResponse.json({ 
                success: false, 
                message: "Coupon not found" 
            }) 
        } 
        return NextResponse.json({ 
            success: true, 
            coupons 
        }) 
    } catch (error) { 
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }) 
    }
}