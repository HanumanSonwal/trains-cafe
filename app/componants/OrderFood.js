"use client";
import { Input, Button, Tabs } from "antd";
import { useState } from "react";

const { TabPane } = Tabs;

const OrderFood = () => {
  const [activeKey, setActiveKey] = useState("1");

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

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
      <div className="">
        <Tabs
          className="custom-tabs shadow-lg rounded-lg"
          activeKey={activeKey}
          onChange={handleTabChange}
          centered
        >
          <TabPane tab="10 Digit PNR" key="1">
            <div className="flex items-center space-x-2 p-6">
              <Input placeholder="Enter PNR No." className="flex-grow " />
              <Button
                type="btn"
                className="bg-[#704D25] text-white border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]"
              >
                Order Now
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Train Name/No." key="2">
            <div className="flex items-center space-x-2 p-6">
              <Input placeholder="Enter Train Name/No." className="flex-grow" />
              <Button
                type="btn"
                className="bg-[#704D25] text-white border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]"
              >
                Order Now
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Station" key="3">
            <div className="flex items-center space-x-2 p-6">
              <Input placeholder="Enter Station" className="flex-grow" />
              <Button
                type="btn"
                className="bg-[#704D25] text-white border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]"
              >
                Order Now
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderFood;
