"use client";
import { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./RecentOrders.css"; 

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/data/recentOrders.json")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="py-8 px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start space-y-6 md:space-y-0 md:space-x-4">
        {/* Left - Recent Orders */}
        <div className="w-full md:w-2/3 py-6">
          <div className="relative mb-4 text-center">
            <img
              src="/images/Recent.png"
              alt="Recent"
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3"
            />
            <h2 className="text-2xl relative text-[#704D25] font-bold z-10">
              Recent Orders
            </h2>
          </div>

          <div className="overflow-hidden w-full relative">
            <div className="flex animate-scroll space-x-6 w-max">
              {[...orders, ...orders].map((order, i) => (
                <Card
                  key={i}
                  className="flex-shrink-0 w-[250px] rounded-lg shadow-md"
                >
                  <p className="text-gray-600 text-sm">
                    <span className="font-bold">{order?.name}</span> placed an
                    order of ₹{order?.amount} in{" "}
                    <span className="font-semibold">{order?.train}</span>
                    {order?.station && ` at ${order?.station}`}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Call Order Box */}
        <div
          className="w-full md:w-1/2 rounded-lg p-4 flex flex-col items-center justify-between bg-[#8B4513] text-white bg-cover bg-center"
          style={{
            minHeight: "300px",
            backgroundImage: 'url("/images/order-bg.png")',
            backgroundSize: "cover",
          }}
        >
          <h2 className="font-bold text-xl text-white text-center">
            Order Food On Call
          </h2>
          <img
            src="/images/order-vector.png"
            alt="Person Ordering Food"
            className="my-4"
          />
          <Link href="tel:918696963496">
            <Button
              type="default"
              icon={<PhoneOutlined />}
              className="common-btn border-none flex items-center justify-center text-sm font-[600] rounded-full"
            >
              Order via call
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
