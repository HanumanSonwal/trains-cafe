"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const CustomerReviews = () => {
  const carouselRef = useRef(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      try {
        const res = await fetch("/data/customerReviews.json");
        const data = await res.json();
        if (mounted) setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load reviews");
      }
    };

    loadReviews();
    return () => {
      mounted = false;
    };
  }, []);

  const truncateText = useCallback((text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }, []);

  const goPrev = useCallback(() => {
    carouselRef.current?.prev();
  }, []);

  const goNext = useCallback(() => {
    carouselRef.current?.next();
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8 bg-gray-100 rounded-md mb-5">
      <div className="flex items-center">
        {/* LEFT */}
        <div className="w-1/3 pr-4">
          <div className="relative mb-4">
            <Image
              src="/images/Testimonial.png"
              alt="Testimonial"
              width={260}
              height={80}
              unoptimized
              className="absolute left-1/2 -translate-x-1/2 -translate-y-2/3 w-full"
            />
            <h2 className="text-xl relative z-10 text-[#704D25] font-bold">
              Reviews By Our Customer
            </h2>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={goPrev}
              className="border text-[#A0522D] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#A0522D] hover:text-white"
              style={{ borderColor: "#A0522D" }}
            >
              <LeftOutlined />
            </button>

            <button
              onClick={goNext}
              className="border text-[#A0522D] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#A0522D] hover:text-white"
              style={{ borderColor: "#A0522D" }}
            >
              <RightOutlined />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-2/3 relative">
          <Carousel
            ref={carouselRef}
            dots={false}
            autoplay
            autoplaySpeed={3000}
            pauseOnHover
          >
            {reviews.map((review) => (
              <div key={review.id || review.name} className="px-4">
                <div className="relative p-2">
                  <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="flex justify-between items-center mb-3">
                      <Image
                        src="/images/Review_icon.png"
                        alt={review.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <Image
                        src="/images/double-quote.png"
                        alt="Quote"
                        width={24}
                        height={24}
                        className="opacity-50"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-1">
                        {review.name}
                      </h3>
                      <p className="text-gray-600 text-xs leading-tight">
                        {truncateText(review.text, 20)}
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
