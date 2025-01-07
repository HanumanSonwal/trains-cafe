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

const { TextArea } = Input;

const BulkOrderForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact?slug=BulkOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: values.Name,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Message: values.Message,
          slug: "BulkOrder",
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          "Thank you! Your bulk order request has been sent successfully."
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
      <div className="relative h-60 md:h-72">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1  className="text-white text-xl md:text-4xl font-bold text-center px-4">
            Bulk Order Request
          </h1>
        </div>
      </div>
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
          <div className=" mb-8">
            <h2 className="text-3xl font-bold text-coffee-600 mb-4">
              Place Your Bulk Food Order
            </h2>
            <p className="text-gray-700">
              Whether you're traveling with family or a large group, we make it
              easy to order food at train stations. Fill out the form below, and
              we'll contact you with customized options for your journey.
            </p>
            <p className="text-gray-700">
            Simply fill out the form below to let us know your requirements, including the number of meals, station details, and any specific preferences. Our team will get in touch with you promptly to confirm your order and provide the best meal options suited to your journey. Trust us to make your travel experience seamless and hassle-free, one tasty meal at a time.
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
                placeholder="Describe your bulk order requirements, station name, and any other details."
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
        <div className="text-center text-sm">
          <p>
            Need immediate assistance? Call us at{" "}
            <a href="tel:+911234567890" className="font-semibold underline">
              +91 1234567890
            </a>{" "}
            or email us at{" "}
            <a
              href="mailto:support@example.com"
              className="font-semibold underline"
            >
              support@example.com
            </a>.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .text-coffee-600 {
          color: #704d25;
        }
        .bg-coffee-600 {
          background-color: #704d25;
        }
        .border-coffee-500 {
          border-color: #704d25;
        }
        .focus:ring-coffee-600 {
          outline-color: #704d25;
        }
      `}</style>
    </div>
  );
};

export default BulkOrderForm;
