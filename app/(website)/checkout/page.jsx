"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, message, Radio } from "antd";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { placeOrder } from "@/services/orders";
import { CSSTransition } from "react-transition-group"; 
import {resetCart} from '@/app/redux/cartSlice';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";



const schema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  alternateMobile: z.string().optional(),
  pnr: z.string().length(10, "PNR must be exactly 10 digits"),
  coach: z.string().optional(),
  seatNo: z.string().optional(),
  instructions: z.string().optional(),
});

const CheckoutPage = () => {
  const { items, vendor, train, station } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("PAYTM");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });


  const handlePlaceOrder = async (data) => {
    console.log(data,"ggg")
    try {
      const payment = {
        method: paymentMethod,
      };

      const response = await placeOrder(vendor, station, train, payment, items, data, couponCode);
      localStorage.setItem("orderData", JSON.stringify(response.data));

      reset();
      dispatch(resetCart());
      message.success("Order placed successfully!");
      router.push("/orderconfirmation");

      setIsCouponApplied(false);
    } catch (error) {
      message.error("Error placing order. Please try again.");
      console.error("Error placing order:", error);
    }
  };

  const handleApplyCoupon = async () => {
    const { email, mobile } = getValues();

    if (!email || !mobile) {
      message.error("Please fill in your user details (email and mobile) before applying the coupon.");
      return;
    }

    try {
      const response = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          email: email,
          phone: `+91${mobile}`,
          cart: items,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setDiscount(result.discount);
        setIsCouponApplied(true);
        setCouponError(false);
        message.success("Coupon applied successfully!");
      } else {
        throw new Error(result.message || "Failed to apply coupon.");
      }
    } catch (error) {
      setCouponError(true);
      message.error(error.message);
      console.error("Error applying coupon:", error);
    }
  };


  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setIsCouponApplied(false);
    message.info("Coupon removed.");
  };

  const totalAmount = items.reduce((total, item) => {
    const price = parseFloat(item.price);
    const quantity = parseInt(item.quantity, 10);
    return total + price * quantity;
  }, 0);

  const gstAmount = totalAmount * 0.05;
  console.log(gstAmount,"gstAmount")
  const WithGstAmount = totalAmount + gstAmount; 

  const payableAmount = WithGstAmount - discount;
  console.log(payableAmount,"payableAmount")


  
  return (
    <div className="max-w-[575px] mx-auto p-4 bg-gray-100 min-h-screen">    
      <h1 className="text-xl font-bold mb-6 text-center text-gray-800">
        Your Order at <span style={{color:'#704d25'}}>Jaipur</span> from{" "}
        <span style={{color:'#704d25'}}>Trains Cafe</span>
      </h1>
      <div className="gap-4">
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Customer Details</h2>


          <Controller
            name="mobile"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Mobile Number</label>
                <Input placeholder="Mobile Number" {...field} />
                {errors.mobile && <span className="text-red-500">{errors.mobile.message}</span>}
              </div>
            )}
          />


          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <Input placeholder="Name" {...field} />
                {errors.name && <span className="text-red-500">{errors.name.message}</span>}
              </div>
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <Input placeholder="Enter Your Email" {...field} />
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
              </div>
            )}
          />

          <Controller
            name="alternateMobile"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Alternate Mobile (Optional)</label>
                <Input placeholder="Alternate Mobile (Optional)" {...field} />
              </div>
            )}
          />

          <Controller
            name="pnr"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">PNR</label>
                <Input placeholder="Enter 10 Digit PNR" {...field} />
                {errors.pnr && <span className="text-red-500">{errors.pnr.message}</span>}
              </div>
            )}
          />

          <div className="flex gap-2 mb-4">
            <Controller
              name="coach"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="w-1/2">
                  <label className="block text-sm text-gray-700 mb-1">Coach</label>
                  <Input placeholder="Coach" {...field} />
                </div>
              )}
            />
            <Controller
              name="seatNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="w-1/2">
                  <label className="block text-sm text-gray-700 mb-1">Seat No.</label>
                  <Input placeholder="Seat No." {...field} />
                </div>
              )}
            />
          </div>

          <Controller
            name="instructions"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Optional Instructions</label>
                <Input.TextArea placeholder="Optional Instructions" {...field} />
              </div>
            )}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-6 text-gray-800">Order Details</h2>
          <table className="w-full mb-6">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Items</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">₹ {item.price}</td>
                  <td className="py-2">₹ {parseInt(item.price, 10) * parseInt(item.quantity, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="border-black border-t-2 mb-2" />

          <div className="space-y-2 ">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Sub Total</span>
              <span>₹ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">GST</span>
              <span>₹ {gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Discount</span>
              <span>₹ {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Delivery Charge</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-md font-bold border-t pt-2">
              <span>Total</span>
              <span>₹ {payableAmount}</span>
            </div>
          </div>
        </div>
      </div>
       <div className="bg-white shadow rounded-lg p-4 mt-4">
          <CSSTransition
            in={isCouponApplied}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div className="flex justify-between items-center">
              <span>Coupon applied: {couponCode}</span>
              <Button type="link" onClick={handleRemoveCoupon}>
                Remove
              </Button>
            </div>
          </CSSTransition>

          {!isCouponApplied && (
            <div className="flex">
             <Input
          placeholder="COUPON CODE"
          className="mb-4"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          suffix={<Button className="text-green-600" onClick={handleApplyCoupon}>Apply</Button>}
        />
            </div>
          )}

          {couponError && (
            <span className="text-red-500">Invalid coupon code. Please try again.</span>
          )}
        </div>

      <div className="bg-white shadow rounded-lg p-4 mt-4">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Payment Options</h2>
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="gap-5"
        >
          <Radio value="PAYTM">Razorpay (UPI / Debit & Credit Cards)</Radio>
          <br />
          <Radio value="COD">Cash on Delivery</Radio>
        </Radio.Group>
      </div>

      <Button
        type="primary"
        className="mt-6  order-btn"
        onClick={handleSubmit(handlePlaceOrder)}
      >
        Place Order
      </Button>
    </div>
  );
};

export default CheckoutPage;

