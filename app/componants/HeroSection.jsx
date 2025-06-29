"use client";

import React from 'react';
import { Button, Carousel } from "antd";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Link from "next/link";

const HeroSection = () => {
  const carouselImages = [
    '/images/herobanner.png',
    '/images/herobanner.png',
    '/images/herobanner.png'
  ];

  return (
    <div className="relative hero-banner">
      <Carousel
        autoplay
      >
        {carouselImages.map((image, index) => (
          <div key={index}>
            <div
              className="h-40  md:h-60 bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}
      </Carousel>

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="p-3">
          <div className="text-left mt-9 md:mt-14 mx-auto relative">
            <img
              src="/images/Tastyfood.png"
              alt="Hero Title Background"
              className="absolute transform -translate-y-1/2"
            />

            <h2 className="text-white font-bold relative se-list-font-family">
              Best Online <br /> Food Delivery  in Train 
            </h2>

            <div className="flex gap-2 mt-4">
              <Link href='tel:090909090'>
                <Button
                  type="primary"
                  className="common-btn border-none rounded-full px-4 py-2 font-semibold bg-[#704D25] hover:bg-[#5a3d1d] flex items-center"
                  icon={<PhoneOutlined />}
                >
                  Order via Call
                </Button>
              </Link>

              <Link href='https://wa.me/090909090'>
                <Button
                  className="common-btn-outline border rounded-full px-4 py-2 font-semibold text-black hover:bg-[#704D25] hover:text-white flex items-center"
                  icon={
                    <WhatsAppOutlined
                      className="bg-[#34a853] rounded-full"
                    />
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