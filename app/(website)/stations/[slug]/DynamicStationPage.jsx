'use client';

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";
import VendorCardWithoutTrain from "../VendorCard";
import StationData from "../StationData";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
  return { name: stationName, code: codePart, slug };
};

export default function DynamicStationPage({ slug, serverData }) {
  const parsedStation = parseStationSlug(slug);

  useEffect(() => {
    if (!serverData) return;
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const pageUrl = `${baseUrl}/stations/${slug}`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": serverData.title || `Order Food on Train at ${parsedStation?.name}`,
      "description": serverData.description || "Get fresh food delivered at your train seat.",
      "keywords": Array.isArray(serverData.keywords)
        ? serverData.keywords.join(", ")
        : serverData.keywords || "order food in train, train food delivery, Trains Cafe",
      "url": pageUrl,
      "publisher": {
        "@type": "Organization",
        "name": "Trains Cafe",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/images/meta_image.png`
        }
      }
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [slug, serverData, parsedStation]);

  if (!serverData) {
    return <StationData selectedStation={parsedStation} />;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "3%", lineHeight: "1.6", textAlign: "justify" }}>
      <h1 style={{ color: "#2c3e50", fontSize: "1.6rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        Order Food on Train at {parsedStation?.name || "Station"}
      </h1>

      <div style={{ marginBottom: "1rem", borderRadius: "12px", overflow: "hidden" }}>
        <Swiper modules={[Autoplay]} slidesPerView={1} loop autoplay={{ delay: 3000 }}>
          {["/images/TrainscafeBanner1.png", "/images/TrainscafeBanner2.png", "/images/TrainscafeBanner3.png", "/images/TrainscafeBanner4.png"].map((src, index) => (
            <SwiperSlide key={index}>
              <Image src={src} alt={`Banner ${index + 1}`} width={1200} height={80} style={{ objectFit: "cover", height: "80px", width: "100%" }} />
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
            {serverData.title || "No Title Provided"}
          </h2>
          {serverData.pageData ? (
            <div className="text-sm md:text-base mb-4 text-justify ck-content" dangerouslySetInnerHTML={{ __html: serverData.pageData }} />
          ) : (
            <p>No content available for this page</p>
          )}
          <Link href="/contact-us" passHref>
            <Button type="default" className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-white">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
