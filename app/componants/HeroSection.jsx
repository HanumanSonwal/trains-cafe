"use client";

import Image from "next/image";
import { Button } from "antd";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Link from "next/link";

const HeroSection = () => {
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

  return (
    <div className="relative hero-banner h-40 md:h-60 w-full">
      <Image
        src="/images/herobanner.webp"
        alt="Best Online Food Delivery in Train"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0">
        <div className="p-3">
          <div className="text-left mt-9 md:mt-14 relative">
            <h2 className="text-white font-bold se-list-font-family">
              Best Online <br /> Food Delivery in Train
            </h2>

            <div className="flex gap-2 mt-4">
              <Link href={`tel:${phone}`}>
                <Button
                  type="primary"
                  className="common-btn border-none rounded-full px-4 py-2 font-semibold bg-[#704D25]"
                  icon={<PhoneOutlined />}
                >
                  Order via Call
                </Button>
              </Link>

              <Link href={`https://wa.me/${whatsapp}`} target="_blank">
                <Button
                  className="common-btn-outline border rounded-full px-4 py-2 font-semibold text-black hover:bg-[#704D25] hover:text-white"
                  icon={
                    <WhatsAppOutlined className="bg-[#34a853] rounded-full" />
                  }
                >
                  Order via WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
