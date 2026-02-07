"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./RecentOrders.css";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const phone = process.env.NEXT_PUBLIC_PHONE;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch("/data/recentOrders.json");
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to load recent orders");
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="py-8 px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start space-y-6 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-2/3 py-6">
          <div className="relative mb-4 text-center">
            <Image
              src="/images/Recent.png"
              alt="Recent Orders"
              width={160}
              height={60}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-2/3"
            />
            <h2 className="text-2xl relative text-[#704D25] font-bold z-10">
              Recent Orders
            </h2>
          </div>

          <div className="overflow-hidden w-full relative">
            <div className="flex animate-scroll space-x-6 w-max">
              {[...orders, ...orders].map((order, i) => (
                <Card
                  key={`${order?.name}-${i}`}
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

        <div className="relative w-full md:w-1/2 rounded-lg p-4 flex flex-col items-center justify-between  text-white overflow-hidden min-h-[300px]">
          <Image
            src="/images/order-bg.png"
            alt="Order Food Background"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover -z-10"
          />

          <h2 className="font-bold text-xl text-white text-center">
            Order Food On Call
          </h2>

          <Image
            src="/images/order-vector.png"
            alt="Person Ordering Food"
            width={180}
            height={180}
            className="my-4"
          />

          <Link href={`tel:${phone}`}>
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
