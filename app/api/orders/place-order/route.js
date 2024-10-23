import { cartCalculation } from '@/app/lib';
import Order from '@/app/models/order';
import OrderItems from '@/app/models/orderItems';
import Station from '@/app/models/station';
import { NextResponse } from 'next/server';



export async function POST(req, context) {
    try {

        const { vendor, station, train, payment, cart, user_details } = await req.json();

        if (!vendor || !station || !train || !payment) {
            return {
                status: 400,
                body: {
                    message: "Invalid request"
                }
            };
        }

        // validate cart and perform calculations
        const { subTotal, tax, total } = cartCalculation(cart)
        
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