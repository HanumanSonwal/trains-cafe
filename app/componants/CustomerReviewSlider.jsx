"use client";
import React, { useRef, useEffect } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const CustomerReviews = () => {
  const carouselRef = useRef();

  const reviews = [
    {
      name: "Customer Name",
      image: "/images/john-doe.png",
      text: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate.",
    },
    {
      name: "Customer Name",
      image: "/images/john-doe.png",
      text: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      carouselRef.current.next();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8 bg-gray-100 rounded-md mb-5">
      <div className="flex items-center">
        <div className="w-1/3 pr-4">
          <div className="relative mb-4">
            <img
              src="/images/Testimonial.png"
              alt="Recent"
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3 w-full"
              // style={{top:'24px'}}
            />
            <h2 className="text-xl relative z-10 text-[#704D25] font-bold">
              Reviews By Our Customer
            </h2>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => carouselRef.current.prev()}
              className="border text-[#A0522D] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#A0522D] hover:text-white"
              style={{ borderColor: "#A0522D" }}
            >
              <LeftOutlined />
            </button>
            <button
              onClick={() => carouselRef.current.next()}
              className="border text-[#A0522D] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#A0522D] hover:text-white"
              style={{ borderColor: "#A0522D" }}
            >
              <RightOutlined />
            </button>
          </div>
        </div>
        <div className="w-2/3 relative">
          <Carousel ref={carouselRef} dots={false} autoplay>
            {reviews.map((review, index) => (
              <div key={index} className="px-4">
                <div className="relative p-2">
                  <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="flex justify-between items-center mb-3">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <img
                        src="/images/double-quote.png"
                        alt="Quote"
                        className="w-6 h-6 opacity-50"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">
                        {review.name}
                      </h3>
                      <p className="text-gray-600 text-xs leading-tight">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
