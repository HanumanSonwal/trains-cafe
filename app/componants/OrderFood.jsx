"use client";
import { Input, Button, Tabs, Select, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { Option } = Select;

const OrderFood = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [pnr, setPnr] = useState("");
  const [train, setTrain] = useState("");
  const [station, setStation] = useState("");
  const router = useRouter();

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  // Function to call PNR search API
  const searchPNR = async () => {
    if (!pnr) {
      return message.error("Please enter a valid PNR number.");
    }
    try {
      const response = await fetch(`/api/rapid/pnr?query=${pnr}`);
      const result = await response.json();
      
      if (response.ok) {
        // Handle the response, like redirecting or displaying details
        message.success("PNR found! Redirecting...");
        // Assuming you want to redirect to another page with PNR details
        router.push(`/pnr-details?pnr=${pnr}`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  // Handle Train search or Station search based on the key
  const handleSearch = () => {
    if (activeKey === "1") {
      searchPNR(); // Search by PNR
    } else if (activeKey === "2") {
      // Handle search by Train Number
      if (!train) return message.error("Please select a train.");
      message.success(`Searching for Train ${train}`);
      router.push(`/train-details?train=${train}`);
    } else if (activeKey === "3") {
      // Handle search by Station
      if (!station) return message.error("Please enter a station.");
      message.success(`Searching for Station ${station}`);
      router.push(`/station-details?station=${station}`);
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
      label: "Train Name/No.",
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Select
            placeholder="Select Train"
            className="flex-grow"
            value={train}
            onChange={setTrain}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="25014">25014 - Moradabad CORBET PRK LINK</Option>
            <Option value="22977">22977 - Jodhpur Intercity SF Express</Option>
            <Option value="22995">22995 - Mandore Superfast Express</Option>
          </Select>
          <Button
            onClick={handleSearch}
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
          <Input
            placeholder="Enter Station"
            className="flex-grow"
            value={station}
            onChange={(e) => setStation(e.target.value)}
          />
          <Button
            onClick={handleSearch}
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
