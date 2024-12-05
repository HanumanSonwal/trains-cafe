// "use client";
// import React, { useState } from 'react';
// import { Form, Input, Button, message } from 'antd';
// import { SendOutlined, UserOutlined, PhoneOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';

// const { TextArea } = Input;

// const OnlineHotelBooking = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/contact?slug=Hotel', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           Name: values.Name,
//           Email: values.Email,
//           ContactNumber: values.ContactNumber,
//           Message: values.Message,
//           slug: 'Hotel'  
//         })
//       });

//       const data = await response.json();

//       if (data.success) {
//         message.success('Thank you! Your bulk order request has been sent successfully.');
//         form.resetFields();
//       } else {
//         throw new Error(data.message || 'Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       message.error('Failed to send message. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-2 flex items-center justify-center">
//       <div className="w-full max-w-[575px] mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 animate-fadeIn">
//           <div className="text-center mb-4">
//             <h1 style={{color:'#704d25'}} className="text-2xl sm:text-xl font-bold  mb-2">
//               Drop Us A Message For Hotel Booking Services</h1>
//             <p className="text-gray-600">
//               We all get back to you with The Best Hotel Booking Services
//             </p>
//           </div>

//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//             className="space-y-4"
//             requiredMark={false}
//           >
//             <Form.Item
//               name="Name"
//               rules={[{ required: true, message: 'Please enter your name' }]}
//             >
//               <Input
//                 prefix={<UserOutlined className="text-gray-400" />}
//                 placeholder="Your Name"
//                 size="large"
//                 className="rounded-lg hover:border-cyan-500 focus:border-cyan-500"
//               />
//             </Form.Item>

//             <Form.Item
//               name="ContactNumber"
//               rules={[
//                 { required: true, message: 'Please enter your contact number' },
//                 { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
//               ]}
//             >
//               <Input
//                 prefix={<PhoneOutlined className="text-gray-400" />}
//                 placeholder="Contact Number"
//                 size="large"
//                 className="rounded-lg hover:border-cyan-500 focus:border-cyan-500"
//                 maxLength={10}
//               />
//             </Form.Item>

//             <Form.Item
//               name="Email"
//               rules={[
//                 { required: true, message: 'Please enter your email' },
//                 { type: 'email', message: 'Please enter a valid email' }
//               ]}
//             >
//               <Input
//                 prefix={<MailOutlined className="text-gray-400" />}
//                 placeholder="Email Address"
//                 size="large"
//                 className="rounded-lg hover:border-cyan-500 focus:border-cyan-500"
//               />
//             </Form.Item>

//             <Form.Item
//               name="Message"
//               rules={[
//                 { required: true, message: 'Please enter your message' },
//                 { min: 10, message: 'Message must be at least 10 characters' }
//               ]}
//             >
//               <TextArea
//                 placeholder="Tell us about your bulk order requirements..."
//                 size="large"
//                 rows={4}
//                 className="rounded-lg resize-none hover:border-cyan-500 focus:border-cyan-500 mb-2"
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
//                 {loading ? 'Sending...' : 'Submit'}
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>

//         <div className="mt-6 text-center text-white">
//           <p className="text-sm">
//             Need immediate assistance? Call us at: <br />
//             <span className="font-semibold hover:underline cursor-pointer">
//               +91 1234567890
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnlineHotelBooking;


"use client";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { SendOutlined, UserOutlined, PhoneOutlined, MailOutlined, MessageOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const OnlineHotelBooking = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact?slug=Hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: values.Name,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Message: values.Message,
          slug: "Hotel",
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success("Thank you! Your hotel booking request has been sent successfully.");
        form.resetFields();
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-60 md:h-72">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1  className="text-white text-xl md:text-4xl font-bold text-center px-4">
            Hotel Booking Request
          </h1>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10">
          <div className="text-center mb-6">
            <h2 style={{ color: "#704d25" }} className="text-2xl sm:text-3xl font-bold mb-2">
              Drop Us a Message
            </h2>
            <p className="text-gray-600">
              We will get back to you with the best hotel booking options.
            </p>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            requiredMark={false}
          >
            <Form.Item
              name="Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Your Name"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
              />
            </Form.Item>

            <Form.Item
              name="ContactNumber"
              rules={[
                { required: true, message: "Please enter your contact number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit number",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Contact Number"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                maxLength={10}
              />
            </Form.Item>

            <Form.Item
              name="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email Address"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
              />
            </Form.Item>

            <Form.Item
              name="Message"
              rules={[
                { required: true, message: "Please enter your message" },
                { min: 10, message: "Message must be at least 10 characters" },
              ]}
            >
              <TextArea
                placeholder="Tell us about your hotel booking requirements..."
                size="large"
                rows={5}
                className="rounded-lg resize-none border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                loading={loading}
                className="w-full h-12 order-btn text-base transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? "Sending..." : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-coffee-600 text-white py-6">
        <div className="text-center">
          <p style={{ color: "#704d25" }} className="text-sm">
            Need immediate assistance? Call us at:
            <br />
            <span className="font-semibold hover:underline cursor-pointer">
              +91 1234567890
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OnlineHotelBooking;
