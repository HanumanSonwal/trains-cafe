import { cartCalculation } from "@/app/lib";
import CouponUsage from "@/app/models/couponUsage";
import Coupon from "@/app/models/coupon";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const {code, userId, cart} = await req.json();

  if (!code || !userId) {
      return NextResponse.json({
            success: false,
            message: "All fields are required"
      })
  }

    const isCouponUsed = await CouponUsage.findOne({
        code, userId
    })
    
    if (isCouponUsed) {
        return NextResponse.json({
            success: false,
            message: "Coupon already used"
        })
    }

    const coupon = await Coupon.findOne({
        code
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
    
    if(coupon.maximumAmount > subTotal) {
        return NextResponse.json({
            success: false,
            message: "Maximum amount for applying this coupon is reached"
        })
    }

    const couponUsage = new CouponUsage({
        code,
        userId
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