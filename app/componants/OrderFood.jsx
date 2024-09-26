"use client";
import { Input, Button, Tabs, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";




const OrderFood = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [pnr, setPnr] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const router = useRouter();

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const searchPNR = async () => {
    if (!pnr) {
      return message.error("Please enter a valid PNR number.");
    }
    try {
      const response = await fetch(`/api/rapid/pnr?query=${pnr}`);
      const result = await response.json();

      if (response.ok) {
        message.success("PNR found! Redirecting...");
        // router.push(`/pnr-details?pnr=${pnr}`);
        router.push(`/station/${pnr}`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  const searchTrain = async () => {
    if (!trainNumber) {
      return message.error("Please enter a valid train number.");
    }
    try {
      const response = await fetch(`/api/rapid/train?query=${trainNumber}`);
      const result = await response.json();

      if (response.ok) {
        message.success("Train found! Redirecting...");
        // router.push(`/train-details?train=${trainNumber}`);
        router.push(`/train-details/${trainNumber}`);

      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  const handleSearch = () => {
    if (activeKey === "1") {
      searchPNR();
    } else if (activeKey === "2") {
      searchTrain();
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "10 Digit PNR",
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Input
            placeholder="Enter PNR No."
            className="flex-grow"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            className="order-btn text-white border-none rounded-full px-4 py-2 text-xs font-[600]"
          >
            Order Now
          </Button>
        </div>
      ),
    },
    {
      key: "2",
      label: "Train No.",
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Input
            placeholder="Enter Train No."
            className="flex-grow"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600]"
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
