'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";
import { useParams } from "next/navigation";
import VendorCardWithoutTrain from "../VendorCard";
import StationData from "../StationData";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Spinner from "@/app/componants/spinner/Spinner";

const parseStationSlug = (slug) => {
  if (!slug) return null;

  const match = slug.match(/^order-food-on-train-at-(.+)-([a-z0-9]+)$/);
  if (!match) return null;

  const namePart = match[1].replace(/-/g, ' ');
  const codePart = match[2].toUpperCase();

  const stationName = namePart
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    name: stationName,
    code: codePart,
    slug
  };
};

export default function Page() {
  const { slug } = useParams();

  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const parsedStation = parseStationSlug(slug);

  useEffect(() => {
    if (!slug) {
      setError("No slug provided");
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        console.log("Fetching for slug:", slug);
        const res = await fetch(`/api/web-station?slug=${slug}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();
        const found = data?.docs?.find(
          p => p.slug === slug && p.status === "published"
        );

        if (found) {
          setPage(found);
          setError(null);
        } else {
          setError("Page not found");
        }
      } catch (err) {
        setError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) return <Spinner/>;

  if (error || !page) return <StationData selectedStation={parsedStation} />;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "3%", lineHeight: "1.6", textAlign: "justify" }}>
      <h1 style={{ color: "#2c3e50", fontSize: "1.6rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        Order Food on Train at {parsedStation?.name || "Station"}
      </h1>

      <div style={{ marginBottom: "1rem", borderRadius: "12px", overflow: "hidden" }}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
        >
          {["/images/TrainscafeBanner1.png", "/images/TrainscafeBanner2.png", "/images/TrainscafeBanner3.png" , "/images/TrainscafeBanner4.png" ].map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                width={1200}
                height={80}
                style={{ objectFit: "cover", height: "80px", width: "100%" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2c3e50", fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
        <Image src="/images/railway.webp" alt="train icon" width={50} height={50} />
        Restaurants at {parsedStation?.name || "Station"}
      </h1>

      <VendorCardWithoutTrain selectedStation={parsedStation} />


      <div className="relative max-w-4xl mx-auto p-4 md:p-6 z-10" style={{ background: "#fcfcfc" }}>
        <div className="relative z-10">
          <h2 style={{ color: "#704D25", fontWeight: "bold" }} className="text-xl md:text-2xl font-semibold mb-4">
            {page.title || "No Title Provided"}
          </h2>

          {page.pageData ? (
            <div
              className="text-sm md:text-base mb-4 text-justify ck-content"
              dangerouslySetInnerHTML={{ __html: page.pageData }}
            />
          ) : (
            <p>No content available for this page</p>
          )}

          <Link href="/contactus" passHref>
            <Button
              type="default"
              className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-white"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .ck-content {
          overflow-x: auto;
        }
        .ck-content table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        .ck-content th,
        .ck-content td {
          border: 1px solid #ddd;
          padding: 8px;
          font-size: 0.875rem;
        }
        .ck-content th {
          background-color: #f4f4f4;
          font-weight: bold;
        }
        .ck-content tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .ck-content tr:hover {
          background-color: #ddd;
        }
        @media (max-width: 768px) {
          .ck-content th,
          .ck-content td {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
