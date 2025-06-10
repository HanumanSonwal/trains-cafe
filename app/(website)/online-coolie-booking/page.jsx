"use client";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  SendOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { TextArea } = Input;

const OnlineCoolieBooking = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact?slug=Coolie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: values.Name,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Message: values.Message,
          slug: "Coolie",
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          "Thank you! Your coolie booking request has been sent successfully."
        );
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
      {/* Banner Section */}
      <div className="relative h-60 md:h-72">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-xl md:text-4xl font-bold text-center px-4">
            Online Coolie Booking
          </h1>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10">
          <div className="text-center mb-6">
            <h2 style={{color:'#704d25'}} className="text-2xl sm:text-3xl font-bold text-coffee-600 mb-2">
              Book a Coolie for Your Journey
            </h2>
            <p className="text-gray-600">
              Ensure a hassle-free journey by booking a coolie through our service. 
              Our professional coolies will assist you with luggage handling from start to finish.
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
                placeholder="Tell us about your coolie booking requirements..."
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

      <footer className="bg-coffee-600 text-white py-6">
        <div className="text-center">
          <p style={{color:'#704d25'}} className="text-sm">
            Need immediate assistance? Call us at: <Link href="tel:+918696963496" className="font-bold text-blue-600 hover:text-blue-800 underline">
                    +91-8696963496
                  </Link> | <Link href="support@traincafe.com" className="font-bold text-blue-600 hover:text-blue-800 underline">
                   support@trainscafe.com
                  </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OnlineCoolieBooking;
