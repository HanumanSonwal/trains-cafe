"use client";
import React from "react";
import HeroSection from "@/app/componants/HeroSection";
import CouponList from "@/app/componants/CouponList";
import RecentOrders from "@/app/componants/RecentOrders";

const page = () => {
  return (
    <>
      <HeroSection />
      <CouponList />
      <RecentOrders />
    </>
  );
};

export default page;
