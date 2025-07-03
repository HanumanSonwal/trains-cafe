// "use client";
// import React, { useState } from "react";
// import { Form, Input, Button, message } from "antd";
// import {
//   SendOutlined,
//   UserOutlined,
//   PhoneOutlined,
//   MailOutlined,
//   MessageOutlined,
// } from "@ant-design/icons";
// import Link from "next/link";

import OnlineHotelBooking from "./OnlineHotelBooking";

// const { TextArea } = Input;

// const OnlineHotelBooking = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/contact?slug=Hotel", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           Name: values.Name,
//           Email: values.Email,
//           ContactNumber: values.ContactNumber,
//           Message: values.Message,
//           slug: "Hotel",
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         message.success(
//           "Thank you! Your hotel booking request has been sent successfully."
//         );
//         form.resetFields();
//       } else {
//         throw new Error(data.message || "Failed to send message");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       message.error("Failed to send message. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="relative h-40 md:h-60">
//         <img
//           src="/images/Trainscafe-Banner.webp"
//           alt="online food delivery in train "
//           className="absolute inset-0 object-cover w-full h-full"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <h1 className="text-white font-bold text-center px-4">
//             Hotel Booking Request
//           </h1>
//         </div>
//       </div>

//       <div className="py-6 px-4">
//         <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10">
//           <div className="text-center mb-6">
//             <h2
//               style={{ color: "#704d25" }}
//               className="text-2xl sm:text-3xl font-bold mb-2"
//             >
//               Travel with the Perfect Stay - Easy Hotel Booking with Trainscafe
//             </h2>
//             <p className="text-gray-600">
//               Are you looking for a comfortable stay for your next trip? Whether
//               it’s a business visit, a family vacation, a romantic getaway, or a
//               holiday break – choosing the right hotel makes all the difference.{" "}
//             </p>
//           </div>
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//             className="space-y-6"
//             requiredMark={false}
//           >
//             <Form.Item
//               name="Name"
//               rules={[{ required: true, message: "Please enter your name" }]}
//             >
//               <Input
//                 prefix={<UserOutlined className="text-gray-400" />}
//                 placeholder="Your Name"
//                 size="large"
//                 className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
//               />
//             </Form.Item>

//             <Form.Item
//               name="ContactNumber"
//               rules={[
//                 { required: true, message: "Please enter your contact number" },
//                 {
//                   pattern: /^[0-9]{10}$/,
//                   message: "Please enter a valid 10-digit number",
//                 },
//               ]}
//             >
//               <Input
//                 prefix={<PhoneOutlined className="text-gray-400" />}
//                 placeholder="Contact Number"
//                 size="large"
//                 className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
//                 maxLength={10}
//               />
//             </Form.Item>

//             <Form.Item
//               name="Email"
//               rules={[
//                 { required: true, message: "Please enter your email" },
//                 { type: "email", message: "Please enter a valid email" },
//               ]}
//             >
//               <Input
//                 prefix={<MailOutlined className="text-gray-400" />}
//                 placeholder="Email Address"
//                 size="large"
//                 className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
//               />
//             </Form.Item>

//             <Form.Item
//               name="Message"
//               rules={[
//                 { required: true, message: "Please enter your message" },
//                 { min: 10, message: "Message must be at least 10 characters" },
//               ]}
//             >
//               <TextArea
//                 placeholder="Tell us about your hotel booking requirements..."
//                 size="large"
//                 rows={5}
//                 className="rounded-lg resize-none border-coffee-500 focus:ring-2 focus:ring-coffee-600"
//                 maxLength={500}
//                 showCount
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 size="large"
//                 icon={<SendOutlined />}
//                 loading={loading}
//                 className="w-full h-12 order-btn text-base transition-all duration-300 transform hover:scale-[1.02]"
//               >
//                 {loading ? "Sending..." : "Submit"}
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//         <div className="py-4 px-4">
//           <p className="py-2">
//             At Trainscafe, we help you find top-rated hotels with ease. Why
//             settle for less when the best is just a few clicks away?
//           </p>
//           <h3 className="font-bold text-[#704D25] mb-2">
//             What are the Benefits of booking hotels with Trainscafe?
//           </h3>

//           <ul className="list-disc list-inside">
//             <li>
//               <b>Wide Range of Choices :</b> Browse hotels based on interior
//               style, location, couple-friendliness, vibe, and required
//               amenities.
//             </li>
//             <li>
//               <b>Best Prices Guaranteed :</b> Enjoy exclusive deals, seasonal
//               offers, and price-match guarantees. Special discounts available on
//               debit/credit card payments.
//             </li>
//             <li>
//               <b>Pay at Hotel Option :</b> Prefer flexibility? You can pay at
//               the hotel’s front desk while check-in. Or you can pre book the
//               room with a 50% advance amount of total payment.
//             </li>
//             <li>
//               <b>24x7 Customer Support :</b> Need help anytime? Our friendly
//               support team is available round the clock to assist you.
//             </li>
//             <li>
//               <b>Personalized Search Filters :</b> Choose the exact that you
//               want with our advanced filters for price, amenities, location, and
//               more.
//             </li>
//           </ul>
//         </div>
//         <div className="py-4 px-4">
//           <p className="py-2">
//             At Trainscafe, we help you find top-rated hotels with ease. Why
//             settle for less when the best is just a few clicks away?
//           </p>
//           <h3 className="font-bold text-[#704D25] mb-2">
//             How to book a reservation with Trainscafe?
//           </h3>
//           <p className="py-2">
//             Booking a hotel reservation with Trainscafe is as easy as a few
//             clicks:
//           </p>

//           <ul className="list-disc list-inside">
//             <li>Visit the Trainscafe website or app.</li>
//             <li>Enter your destination, check-in, and check-out dates.</li>
//             <li>Choose the number of rooms and guests.</li>
//             <li>
//               Use filters to find hotels that match your budget and preferences.
//             </li>
//             <li>
//               Confirm your booking and receive instant confirmation. Facing
//               issues? Call or WhatsApp us at{" "}
//               <Link
//                 href="tel:+918696963496"
//                 className="font-bold text-blue-600 hover:text-blue-800 underline"
//               >
//                 +91-8696963496
//               </Link>{" "}
//             </li>
//           </ul>
//         </div>
//         <div className="py-4 px-4">
//           <h3 className="font-bold text-[#704D25] mb-2">
//             Planning a Budget-Friendly Stay with Your Partner?
//           </h3>
//           <p className="py-2">
//            Looking for affordable, couple-friendly stays? Use our filter tools to choose budget hotels without compromising on comfort. Trainscafe helps you find the right stay - while saving your money too. <b>Trainscafe</b> helps you to save your pocket with the best option.
//           </p>
//         </div>
//         <div className="py-4 px-4">
//           <h3 className="font-bold text-[#704D25] mb-2">
//             Exclusive Offers and Discounts

//           </h3>
//           <p className="py-2">
//            Make the most of your booking with exciting promo codes, cashback deals, and seasonal discounts. Whether it's a holiday or a work trip - we ensure you always get value for your money.
//           </p>
//         </div>
//         <div className="py-4 px-4">
          
//           <h3 className="font-bold text-[#704D25] mb-2">
//            Why Choose Trainscafe for Your Stay?

//           </h3>

//           <ul className="list-disc list-inside">
//             <li>
//               No hidden charges - What you see is what you pay.
//             </li>
//             <li>
//                ️ Flexible payment options - including “Pay at Hotel”.

//             </li>
//             <li>
//               Wide hotel network across India.

//             </li>
//             <li>
//                Easy-to-use booking system with real-time availability.

//             </li>
//             <li>
//               Trusted by thousands of Indian train travelers.

//             </li>
//           </ul>
//         </div>
//          <div className="py-4 px-4">
//            <h2
//               style={{ color: "#704d25" }}
//               className="text-2xl sm:text-3xl font-bold mb-2"
//             >
//              Make Your Next Stay Joyful with Trainscafe

//             </h2>
//             <p className="py-2">
//               Explore hotels, compare options, and book your ideal stay today.

//             </p>
//          </div>
         
//       </div>

//       {/* Footer Section */}
//       <footer className="bg-coffee-600 text-white py-4 px-4">
//         <div className="text-center">
//           <p style={{ color: "#704d25" }} className="text-sm font-bold">
//             For reservations or assistance, Call us at:{" "}
//             <Link
//               href="tel:+918696963496"
//               className="font-bold text-blue-600 hover:text-blue-800 underline"
//             >
//               +91-8696963496
//             </Link>{" "}
//             |{" "}
//             <Link
//               href="support@trainscafe.in"
//               className="font-bold text-blue-600 hover:text-blue-800 underline"
//             >
//               support@trainscafe.in
//             </Link>
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default OnlineHotelBooking;


export const metadata = {
  title: "Online Hotel Booking | Book Best Hotels for Your Journey | Trains Cafe",
  description:
    "Book hotels online with Trains Cafe. Get the best deals, exclusive offers, and comfortable stays for your travel. Easy booking, 24x7 support, flexible payment options.",
  keywords:
    "online hotel booking, hotel reservation, book hotels online, couple friendly hotel, best hotel deals, trains cafe hotels",
  openGraph: {
    title: "Online Hotel Booking | Trains Cafe",
    description:
      "Reserve your stay with Trains Cafe. Wide range of budget-friendly and premium hotels for a comfortable travel experience. Best rates, verified stays, easy payment.",
    url: `${process.env.NEXT_PUBLIC_URL || "https://trainscafe.in"}/online-hotel-booking`,
  },
};

export default function Page() {
  return <OnlineHotelBooking />;
}