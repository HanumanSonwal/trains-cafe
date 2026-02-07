"use client";

import React, { useCallback } from "react";
import Image from "next/image";
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
import dynamic from "next/dynamic";

// lazy load heavy sections
const PromoBanner = dynamic(() => import("@/app/componants/PromoBanner"), {
  ssr: false,
});
const RecentOrders = dynamic(() => import("@/app/componants/RecentOrders"), {
  ssr: false,
});

// icons as references (not JSX)
const tools = [
  { label: "Bulk Orders", icon: ShoppingCartOutlined, link: "/group-food-ordering-in-train" },
  { label: "PNR Status", icon: CreditCardOutlined, link: "/pnr-status" },
  { label: "Coolie Services", icon: TeamOutlined, link: "/online-coolie-booking" },
  { label: "Hotel Booking", icon: HomeOutlined, link: "/online-hotel-booking" },
  { label: "Train B/W Stations", icon: SwapOutlined, link: "/train-between-stations" },
  { label: "Updates", icon: FieldTimeOutlined, link: "/blog" },
  { label: "Partner", icon: DollarOutlined, link: "/vendor-registration" },
  { label: "Station Details", icon: EnvironmentOutlined, link: "/stations" },
];

const AllServicesClient = () => {
  const router = useRouter();
  const phone = process.env.NEXT_PUBLIC_PHONE;

  const handleCardClick = useCallback(
    (link) => {
      if (link) router.push(link);
    },
    [router]
  );

  return (
    <>
      {/* HERO */}
      <div className="relative h-40 md:h-60 w-full">
        <Image
          src="/images/Trainscafe-Banner.webp"
          alt="food in train by traincafe"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-xl md:text-4xl font-bold text-center px-4">
            All Services
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center justify-start bg-white py-8 px-4">
        <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 text-center">
          All Railway Services in One Platform
        </h2>

        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
          Enjoy easy food booking in train, quick PNR checks, train updates,
          and railway details, all designed to save your time and effort
          with Trainscafe.
        </p>

        {/* SERVICES GRID */}
        <Row gutter={[24, 24]} justify="center" className="max-w-2xl">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Col
                xs={8}
                sm={6}
                md={6}
                key={tool.link}
                className="flex justify-center"
              >
                <Card
                  hoverable
                  bordered={false}
                  role="button"
                  tabIndex={0}
                  className="flex flex-col items-center text-center shadow-none transition-transform duration-200 hover:scale-105 cursor-pointer"
                  bodyStyle={{ padding: 0 }}
                  onClick={() => handleCardClick(tool.link)}
                  onKeyDown={(e) => e.key === "Enter" && handleCardClick(tool.link)}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center justify-center mb-2 rounded-full"
                      style={{
                        backgroundColor: "#FCE7BE",
                        color: "#D6872A",
                        width: 64,
                        height: 64,
                        fontSize: 26,
                      }}
                    >
                      <Icon />
                    </div>

                    <p className="text-xs font-medium text-gray-700 w-[90px] leading-tight">
                      {tool.label}
                    </p>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* CTA BUTTONS */}
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
            onClick={() => (window.location.href = `tel:${phone}`)}
          >
            {phone}
          </Button>
        </div>
      </div>

      {/* LAZY SECTIONS */}
      <PromoBanner />
      <RecentOrders />
    </>
  );
};

export default AllServicesClient;
