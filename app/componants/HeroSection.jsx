"use client";

import React from "react";
import { Button } from "antd";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";

const HeroSection = () => {
  return (
    <div className="hero-banner">
    
      <div className="p-5">
        <div className="text-left mt-8 mx-auto relative">
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
            <Button
              type="btn"
              className="bg-[#704D25] text-white border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#ffffff] hover:text-[#704D25]"
              icon={<PhoneOutlined />}
            >
              Order via Call
            </Button>
            <Button
              type="btn"
              className="border-[#704D25] text-white border rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#704D25] hover:text-white"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
