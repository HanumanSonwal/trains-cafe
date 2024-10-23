import { cartCalculation } from '@/app/lib';
import Order from '@/app/models/order';
import OrderItems from '@/app/models/orderItems';
import Station from '@/app/models/station';
import CouponUsage from '@/app/models/couponUsage';
import Coupon from '@/app/models/coupon';
import { NextResponse } from 'next/server';
import { isValidNumber } from "libphonenumber-js";
import * as EmailValidator from 'email-validator';



export async function POST(req, context) {
    try {

        const { vendor, station, train, payment, cart, user_details, couponCode } = await req.json();

        if (!vendor || !station || !train || !payment) {
            return {
                status: 400,
                body: {
                    message: "Invalid request"
                }
            };
        }

        const { email, phone } = user_details;

        let coupon = null

        if (couponCode) {
            if(EmailValidator.validate(email)) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid email for applying coupon"
                })
            }

            if (!isValidNumber(phone)) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid phone number for applying coupon"
                })
            }

            const isCouponUsed = await CouponUsage.findOne({
                code: couponCode, email, phone
            })

            if (isCouponUsed) {
                return NextResponse.json({
                    success: false,
                    message: "Coupon already used"
                })
            }

            coupon = await Coupon.findOne({
                code: couponCode, status: "published"
            })

            if(!coupon) {
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
            
        }

        // validate cart and perform calculations
        const { subTotal, tax, total, discount } = cartCalculation(cart, coupon);
        
        let paymentBody = {}
        if (payment.method == 'COD') { 
            paymentBody.payment_method = "COD",
            paymentBody.payment_status = "pending",
            paymentBody.amount = total,
            paymentBody.tax =  tax,
            paymentBody.vpa = "",
            paymentBody.rp_payement_id = ""
        } else {
            // create an order on razorpay
        }

        const stationRes = await Station.findOne({
            code: station.station_code
        })

        if (!stationRes) {
            return NextResponse.json({
                success: false,
                message: "Invalid station"
            })
        }

        // Create a new order
        const order = new Order({
            vendor: vendor._id,
            station: stationRes._id,
            total,
            subTotal,
            train,
            couponAmount: discount,
            user_details,
            payment : paymentBody,
            status: "pending"
        });

        // Save the order
        await order.save();

        // Create an array of order items
        const orderItems = cart.map((item) => ({
            Order_Id: order._id,
            Item_Id: item._id,
            Quantity: item.quantity,
            Price: item.price
        }));

        // Save the order items
        await OrderItems.insertMany(orderItems);

        const couponUsage = new CouponUsage({
            code: couponCode,
            email,
            phone
        });

        await couponUsage.save();

       return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            data: order
        }   
       )
        
    } catch (error) {
        console.error("Error placing order:", error);
    return    NextResponse.json({
            success: false,
            message: error.message
        })
    }
}