"use client";
import { Input, Button, Tabs, Select } from "antd";
import Link from "next/link";
import { useState } from "react";

const { Option } = Select;

const OrderFood = () => {
  const [activeKey, setActiveKey] = useState("1");

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const tabItems = [
    {
      key: "1",
      label: "10 Digit PNR",
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Input placeholder="Enter PNR No." className="flex-grow" />
          <Button
            type="btn"
            className="order-btn text-white border-none rounded-full px-4 py-2 text-xs font-[600]"
          >
            Order Now
          </Button>
        </div>
      ),
    },
    {
      key: "2",
      label: "Train Name/No.",
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Select
            placeholder="Select Train"
            className="flex-grow"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="25014">25014 - Moradabad CORBET PRK LINK</Option>
            <Option value="22977">22977 - Jodhpur Intercity SF Express</Option>
            <Option value="22995">22995 - Mandore Superfast Express</Option>
          </Select>
          <Link href="/station" passHref>
          <Button
            type="btn"
            className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600]]"
          >
            Order Now
          </Button>
          </Link>
        </div>
      ),
    },
    {
      key: "3",
      label: "Station",
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Input placeholder="Enter Station" className="flex-grow" />
          <Button
            type="btn"
            className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600]]"
          >
            Order Now
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="py-8 px-2 mt-8">
      <div className="relative text-center mb-4">
        <img
          src="/images/Order.png"
          alt="Order Food Title Background"
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3"
        />
        <h2 className="text-[#704D25] text-2xl font-bold relative z-10">
          Order Your Food
        </h2>
      </div>
      <div>
        <Tabs
          className="custom-tabs shadow-lg rounded-lg"
          activeKey={activeKey}
          onChange={handleTabChange}
          centered
          items={tabItems}
        />
      </div>
    </div>
  );
};

export default OrderFood;
