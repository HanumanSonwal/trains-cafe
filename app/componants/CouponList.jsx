"use client";

import React, { useState, useEffect } from "react";
import { Input, Spin, Empty } from "antd";
import {
  CheckCircleFilled,
  CopyOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const fetchCoupons = async (query = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/coupon?page=1&limit=10&search=${query}`);
      const data = await res.json();
      setCoupons(data.docs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCoupons(search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold text-[#6F4D27] mb-1">
          🎟️ Trainscafe Discount Coupon Offers
        </h1>
        <p className="text-lg text-gray-600">Save More, Eat Better in Train</p>
      </div>

      <div className="flex justify-center mb-5">
        <Input
          placeholder="Search by title or code..."
          prefix={<SearchOutlined className="text-[#6F4D27]" />}
          suffix={
            search ? (
              <CloseCircleOutlined
                className="cursor-pointer text-[#6F4D27] hover:text-[#D6872A]"
                onClick={() => setSearch("")}
              />
            ) : null
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 py-2 rounded-lg border-[#D6872A] focus:border-[#6F4D27]"
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 bg-[#FAF3CC]  ">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : coupons.length === 0 ? (
          <Empty description="No coupons found" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="relative bg-[#FFF8E1] rounded-2xl shadow-md border border-dashed border-[#D6872A]/50 overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FAF3CC] rounded-full border border-[#D6872A]/30"></div>

                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FAF3CC] rounded-full border border-[#D6872A]/30"></div>

                <div className="bg-gradient-to-r from-[#D6872A] to-[#6F4D27] text-white text-center py-3 font-semibold text-lg tracking-wide">
                  {coupon.discount?.value}% OFF
                </div>

                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-[#6F4D27] capitalize">
                    {coupon.title}
                  </h3>

                  <p className="text-sm text-[#8B5E3C] mb-2">
                    Code:{" "}
                    <span className="font-mono font-bold text-[#6F4D27]">
                      {coupon.code}
                    </span>
                  </p>

                  <p className="text-xs text-[#A97B4F] mb-4">
                    Valid till{" "}
                    {new Date(coupon.endDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code || "");
                      setCopiedId(coupon._id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition transform 
    ${
      copiedId === coupon._id
        ? "bg-[#6F4D27] text-white scale-105"
        : "bg-[#D6872A] text-white hover:bg-[#6F4D27] hover:scale-105"
    }`}
                  >
                    {copiedId === coupon._id ? (
                      <>
                        <CheckCircleFilled className="text-white" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyOutlined className="text-white" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CouponList;
