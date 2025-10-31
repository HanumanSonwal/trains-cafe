"use client";
import React from "react";
import { Card, Row, Col, Button } from "antd";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  TeamOutlined,
  HomeOutlined,
  SwapOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import PromoBanner from "@/app/componants/PromoBanner";
import RecentOrders from "@/app/componants/RecentOrders";

const tools = [
  { label: "Bulk Orders", icon: <ShoppingCartOutlined />, link: "/group-food-ordering-in-train" },
  { label: "PNR Status", icon: <CreditCardOutlined />, link: "/pnr-status" },
  { label: "Coolie Services", icon: <TeamOutlined />, link: "/online-coolie-booking" },
  { label: "Hotel Booking", icon: <HomeOutlined />, link: "/online-hotel-booking" },
  { label: "Train B/W Stations", icon: <SwapOutlined />, link: "/train-between-stations" },
  { label: "Station Arr/Dep", icon: <FieldTimeOutlined />, link: "/station-arr-dep" },
  { label: "Fare Enquiry", icon: <DollarOutlined />, link: "/fare-enquiry" },
  { label: "Station Details", icon: <EnvironmentOutlined />, link: "/station-details" },
];

const Page = () => {
  const router = useRouter();

  const handleCardClick = (link) => {
    if (link) router.push(link);
  };

  return (
    <>
      <div className="relative h-40 md:h-60">
        <img
          src="/images/Trainscafe-Banner.webp"
          alt="food in train by traincafe"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-xl md:text-4xl font-bold text-center px-4">
            All Services
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start bg-white py-8 px-4">
        <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 text-center">
          All services at one place
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
          Explore all TrainsCafe tools — from booking food to checking train
          details, fare enquiry, PNR status and more, all in one place!
        </p>

        <Row gutter={[24, 24]} justify="center" className="max-w-2xl">
          {tools.map((tool, index) => (
            <Col xs={8} sm={6} md={6} key={index} className="flex justify-center">
              <Card
                hoverable
                bordered={false}
                className="flex flex-col items-center text-center shadow-none transition-transform duration-200 hover:scale-105 cursor-pointer"
                bodyStyle={{ padding: 0 }}
                onClick={() => handleCardClick(tool.link)}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: "#FCE7BE",
                      color: "#D6872A",
                      borderRadius: "50%",
                      width: 64,
                      height: 64,
                      fontSize: 26,
                    }}
                  >
                    {tool.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-700 w-[90px] leading-tight">
                    {tool.label}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="flex flex-row items-center mt-8 gap-3 w-full max-w-xs">
          <Button
            type="primary"
            block
            style={{
              backgroundColor: "#D6872A",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 45,
            }}
            onClick={() => router.push("/")}
          >
            🍽 BOOK FOOD
          </Button>

          <Button
            block
            icon={<PhoneOutlined />}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 45,
            }}
            onClick={() => (window.location.href = "tel:8696963496")}
          >
            8696963496
          </Button>
        </div>
      </div>

      <PromoBanner />
      <RecentOrders />
    </>
  );
};

export default Page;
