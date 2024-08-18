import React from "react";
import { Button } from "antd";
import Link from "next/link";

const PromoBanner = () => {
  return (
    <div
      className="relative mb-4 py-8  w-full h-[230px] overflow-hidden rounded-lg max-w-[575px] mx-auto bg-cover bg-center"
      style={{ backgroundImage: "url('/images/promo.png')" }}
    >
      <div className="absolute right-0 top-0 bottom-0  sm:w-1/2 flex flex-col justify-center items-start p-4 sm:p-8">
        <div className="relative mb-4 w-full">
          <img
            src="/images/offer.png"
            alt="Title Overlay"
            className="absolute left-1/4 transform -translate-x-1/2 -translate-y-1/2 "
          />
          <h2 className="relative text-white text-xl sm:text-2xl z-10 font-bold leading-tight">
            Exclusive Offer,
            <br />
            Grab It Soon
          </h2>
        </div>
        <Link href='tel:090909090'>
        <Button
          type="btn"
          className="common-btn text-white border-none  text-sm font-[600]"
        >
          Order Now
        </Button>
        </Link>
      </div>

      <div className="absolute top-0 right-0 flex flex-col items-center">
        <div className="bg-red-600 text-white py-1 px-2 sm:px-3 transform skew-x-[-15deg] text-center">
          <span className="text-xs sm:text-sm font-bold">50%</span>
        </div>
        <div className="bg-red-700 text-white py-1 px-2 sm:px-3 transform skew-x-[-15deg] text-center">
          <span className="text-xs sm:text-sm font-bold">OFF</span>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
