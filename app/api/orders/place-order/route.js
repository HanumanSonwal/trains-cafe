import { cartCalculation } from '@/app/lib';
import Order from '@/models/order';
import OrderItems from '@/models/orderItems';


export async function POST(req, context) {
    try {

        const { vendor, station, train, payment, cart } = await req.json();

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
        if (payment.method !== 'COD') { 
            paymentBody.payment_method = payment.method,
            paymentBody.payment_status = "pending",
            paymentBody.amount = total,
            paymentBody.tax =  tax,
            paymentBody.vpa =  ""
        } else {
            // create an order on razorpay
        }

        // Create a new order
        const order = new Order({
            vendor: vendor._id,
            station: station._id,
            total,
            subTotal,
            train,
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

        return {
            status: 200,
            body: {
                message: "Order placed successfully"
            }
        };
        
    } catch (error) {
        console.error("Error placing order:", error);
        return {
            status: 500,
            body: {
                message: "Error placing order"
            }
        };
    }
}