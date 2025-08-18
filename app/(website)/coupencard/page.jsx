"use client";

import React, { useState, useEffect } from "react";
import { Card, Pagination, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";

const { Meta } = Card;

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const couponsPerPage = 2;

  const fetchCoupons = async () => {
    const searchQuery = searchTerm ? `&search=${searchTerm}` : "";

    try {
      const response = await fetch(
        `/api/coupon?page=${currentPage}&limit=${couponsPerPage}${searchQuery}`
      );
      const data = await response.json();
      setCoupons(data.docs);
      setTotalCoupons(data.totalDocs);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="relative h-40 md:h-60 mb-4">
        <img
          src="/images/Trainscafe-Banner.webp"
          alt="online delivery for food in train"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white  font-bold">Coupons</h1>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <Input.Search
          placeholder="Search coupons"
          onChange={handleSearchChange}
          className="mb-4 w-1/2"
          allowClear
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8 px-4">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="w-full shadow-lg rounded-lg relative"
            >
              <Card
                hoverable
                cover={
                  <div className="relative">
                    <img
                      alt={coupon.title}
                      src={coupon.image}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">
                    {dayjs(coupon.validity).format("DD MMM YYYY")}
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <img
                      src="/images/user-icon.png"
                      alt="Issuer"
                      className="w-4 h-4 mr-2"
                    />
                    <p>By {coupon.issuer}</p>
                  </div>
                </div>
                <Meta
                  className="text-[#3A3A3A]"
                  title={coupon.title}
                  description={coupon.description}
                />
                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/coupon/${coupon.slug}`}
                    className="flex items-center"
                  >
                    View Details <ArrowRightOutlined className="ml-1" />
                  </Link>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No coupons available.
          </div>
        )}
      </div>

      <div className="mt-8 text-center flex justify-center mb-3">
        <Pagination
          current={currentPage}
          total={totalCoupons}
          pageSize={couponsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default CouponPage;
