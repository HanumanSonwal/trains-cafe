"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import {
  SendOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { postData ,fetchData } from "@/app/lib/ApiFuntions";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;

const VendorRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      const data = await fetchData("/api/station?search=&page=0");
      if (data.data) {
        setStations(data.data);
      } else {
        message.error("Failed to load station list. Please try again.");
      }
    };
    fetchStations();
  }, []);
  
  const onFinish = async (values) => {
    setLoading(true);
    const data = await postData("/api/vendorregistration", values);
    
    if (data.success) {
      message.success("Vendor registered successfully!");
      form.resetFields();
    } else {
      message.error("Failed to register vendor. Please try again.");
    }
    setLoading(false);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-60 md:h-72 ">
       <div>
         <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
       </div>
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white  text-xl md:text-4xl font-bold text-center px-4">
            Vendor Registration
          </h1>
        </div>
      </div>

      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10 gap-3">
          <div className="mb-6">
            <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            requiredMark={false}
          >
            <Form.Item
              name="Vendor_Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Vendor Name"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
              />
            </Form.Item>

            <Form.Item
              name="Restaurant_Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your restaurant name",
                },
              ]}
            >
              <Input
                placeholder="Restaurant Name"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
              />
            </Form.Item>

            <Form.Item
              name="Contact_No"
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
              name="Station"
              rules={[{ required: true, message: "Please select a station" }]}
            >
              <Select
                showSearch
                placeholder="Select Station"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stations.length > 0 ? (
                  stations.map((station) => (
                    <Option key={station._id} value={station._id}>
                      {station.name}
                    </Option>
                  ))
                ) : (
                  <Option value="">Loading stations...</Option>
                )}
              </Select>
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
              name="Distance"
              rules={[
                {
                  required: true,
                  message: "Please enter distance from station",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Distance (in km)"
                size="large"
                className="rounded-lg border-coffee-500 focus:ring-2 focus:ring-coffee-600"
                min={0}
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
                {loading ? "Submitting..." : "Register"}
              </Button>
            </Form.Item>
          </Form>
          </div>
          <div>
            <h2
              className="text-center text-2xl sm:text-3xl font-bold mb-4"
              style={{ color: "#704d25" }}
            >
              Join the Trains Cafe Vendor Network
            </h2>
            <p className="text-gray-600 mb-4">
              Reach more customers by registering your restaurant with us.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Trains Cafe™</strong> is a premier online platform
              delivering fresh and hygienic meals across Train Food Delivery and
              Tiffin Services. With a Pan-India presence in over 150 cities, we
              focus on <strong>quality</strong>, <strong>hygiene</strong>, and{" "}
              <strong>customer satisfaction</strong>.
            </p>
            <p className="text-gray-600 mb-4">
              By partnering with us, you commit to providing{" "}
              <strong>premium quality food</strong>,{" "}
              <strong>excellent service</strong>, and{" "}
              <strong>safe packaging</strong> to ensure customer delight.
              Together, we’ll work towards creating rewarding dining experiences
              for all.
            </p>
            <p className="text-gray-600 mb-4">
              Let’s embark on this journey together and bring your delicious
              meals to customers across India!
            </p>
            <h3
              className="text-xl sm:text-2xl font-semibold mb-4"
              style={{ color: "#704d25" }}
            >
              Steps to Register as a Vendor
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Complete</strong> the online registration form.
              </li>
              <li>
                <strong>Our Vendor Team</strong> will contact you for mandatory
                documentation.
              </li>
              <li>
                <strong>Sign</strong> the agreement with Trains Cafe.
              </li>
              <li>
                <strong>Pay</strong> the registration fees (T&C apply).
              </li>
              <li>
                <strong>Start receiving</strong> orders for Train Food Delivery
                and Tiffin Services.
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              <strong>Note:</strong> Trains Cafe reserves the right to accept or
              reject applications at its sole discretion.
            </p>
          </div>

          
        </div>
      </div>

      <footer className="bg-coffee-600 text-white py-2">
        <div className="text-center">
          <p style={{ color: "#704d25" }} className="text-sm">
            Need help? Contact us at:
            <br />
            <span className="font-semibold hover:underline cursor-pointer">
              
              
               <Link href="tel:+918696963496" className="font-bold text-blue-600 hover:text-blue-800 underline">
                    +91-8696963496
                  </Link> | <Link href="support@traincafe.com" className="font-bold text-blue-600 hover:text-blue-800 underline">
                   support@traincafe.com
                  </Link>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VendorRegistration;
