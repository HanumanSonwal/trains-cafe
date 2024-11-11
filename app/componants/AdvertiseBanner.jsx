import React from "react";
import { Button } from "antd";
import Link from "next/link";

const AdvertiseBanner = () => {
  return (
    <div
      className="relative mb-4 py-8  w-full h-[230px] overflow-hidden rounded-lg max-w-[575px] mx-auto bg-cover"
      style={{ backgroundImage: "url('/images/advertiseBanner.webp')" }}
    >
      <div className="absolute right-0 top-0 bottom-0  sm:w-1/2 flex flex-col justify-center items-start p-4 sm:p-8">
        <div className="relative mb-4 w-full">
          <img
            src="/images/Offer.png"
            alt="Title Overlay"
            className="absolute left-1/4 transform -translate-x-1/2 -translate-y-1/2 "
          />         
        </div>      
      </div>      
    </div>
  );
};

export default AdvertiseBanner;
