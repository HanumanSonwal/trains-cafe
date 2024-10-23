import { cartCalculation } from "@/app/lib";
import CouponUsage from "@/app/models/couponUsage";
import Coupon from "@/app/models/coupon";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { isValidNumber } from "libphonenumber-js";
import * as EmailValidator from 'email-validator';


export async function POST(req, res) {
  try {
    const {code, email, phone, cart} = await req.json();

  if (!code || !email || !phone) {
      return NextResponse.json({
            success: false,
            message: "All fields are required"
      })
      }
      
      
    if (!isValidNumber(phone)) {
        return NextResponse.json({
            success: false,
            message: "Invalid phone number"
        })
      }
      
      if (!EmailValidator.validate(email)) {
        return NextResponse.json({
            success: false,
            message: "Invalid email"
        })
      }


      await dbConnect();

      
      const isCouponUsed = await CouponUsage.findOne({
        code, email, phone
    })
    
    if (isCouponUsed) {
        return NextResponse.json({
            success: false,
            message: "Coupon already used"
        })
    }

    const coupon = await Coupon.findOne({
        code, status: "published"
    })
      

    if (!coupon) {
        return NextResponse.json({
            success: false,
            message: "Coupon not found"
        })
      }
      
      if (coupon.startDate > new Date() || coupon.endDate < new Date()) {
        return NextResponse.json({
            success: false,
            message: "Coupon is expired"
        })
    }
      
    // validate cart and perform calculations
    const { discount, subTotal, total, tax } = cartCalculation(cart, coupon);
    
    if(coupon.maximumAmount < subTotal) {
        return NextResponse.json({
            success: false,
            message: "Cart amount is greater than maximum amount allowed for this coupon" 
        })
    }

    const couponUsage = new CouponUsage({
        code, email, phone
    });

    await couponUsage.save();

    return NextResponse.json({
        success: true,
        discount,
        subTotal,
        total,
        tax
    })

  } catch (error) {
          return NextResponse.json({
                success: false,
                message: error.message
          })
  }
}