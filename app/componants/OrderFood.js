"use client";
import { Input, Button, Tabs } from "antd";
import { useState } from "react";

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
          <Input placeholder="Enter Train Name/No." className="flex-grow" />
          <Button
            type="btn"
            className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600]]"
          >
            Order Now
          </Button>
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
