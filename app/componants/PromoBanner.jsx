"use client";

import Image from "next/image";
import { Button } from "antd";
import Link from "next/link";

const PromoBanner = () => {
  const phone = process.env.NEXT_PUBLIC_PHONE;

  return (
    <div className="relative mb-4 w-full h-[230px] overflow-hidden rounded-lg max-w-[575px] mx-auto">
      <Image
        src="/images/promo.png"
        alt="Promo Banner"
        fill
        unoptimized
        className="object-cover"
      />

      <div className="absolute right-0 top-0 bottom-0 sm:w-1/2 flex flex-col justify-center items-start p-4 sm:p-8 z-10">
        <div className="relative mb-4 w-full">
          <Image
            src="/images/Offer.png"
            alt="Title Overlay"
            width={120}
            height={60}
            unoptimized
            className="absolute left-1/4 -translate-x-1/2 -translate-y-1/2"
          />

          <h2 className="relative text-white text-xl sm:text-2xl font-bold leading-tight">
            Exclusive Offer,
            <br />
            Grab It Soon
          </h2>
        </div>

        <Link href={`tel:${phone}`}>
          <Button
            type="primary"
            className="common-btn text-white border-none text-sm font-semibold"
          >
            Order Now
          </Button>
        </Link>
      </div>

      <div className="absolute top-0 right-0 flex flex-col items-center z-10">
        <div className="bg-red-600 text-white py-1 px-2 sm:px-3 transform -skew-x-12">
          <span className="text-xs sm:text-sm font-bold">50%</span>
        </div>
        <div className="bg-red-700 text-white py-1 px-2 sm:px-3 transform -skew-x-12">
          <span className="text-xs sm:text-sm font-bold">OFF</span>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
