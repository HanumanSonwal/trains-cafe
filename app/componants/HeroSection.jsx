"use client";

import React from "react";
import { Button } from "antd";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="hero-banner">
    
      <div className="p-3">
        <div className="text-left mt-10 mx-auto relative">
          <img
            src="/images/Tastyfood.png"
            alt="Hero Title Background"
            className="absolute  transform  -translate-y-1/2"
            
            // style={{ top: "-25px" }}
          />

          <h2
            className="text-white font-bold relative"
           
          >
            Munching Through <br /> The Miles!
          </h2>

          <div className="flex gap-2 mt-4">
          <Link href='tel:090909090'>
            <Button          
              type="btn"
              className="common-btn border-none rounded-full px-4 py-2  font-[600]"
              icon={<PhoneOutlined />}
              
            >
              Order via Call
            </Button>
            </Link>
            <Link href='https://wa.me/090909090'>
            <Button
              type="btn"
              className="common-btn-outline border rounded-full px-4 py-2  font-[600] hover:bg-[#704D25] hover:text-white"
              icon={
                <WhatsAppOutlined
                  style={{
                    color: "#fff",
                    backgroundColor: "#34a853",
                    borderRadius: "30px",
                  }}
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
  );
};

export default HeroSection;
