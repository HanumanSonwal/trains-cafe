import React, { useState } from "react";
import VendorCardWithoutTrain from "./VendorCard";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import BlogSection from "@/app/componants/BlogSection";

const StationData = ({ selectedStation }) => {
  const [expanded, setExpanded] = useState(false);
  const { name: stationName, value: stationCode } = selectedStation || {};
 const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";
  const pageUrl = `${BASE_URL}/stations/${stationCode}`;
  const toggleReadMore = () => setExpanded(!expanded);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        {" "}
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
        >
          {[
            "/images/TrainscafeBanner1.png",
            "/images/TrainscafeBanner2.png",
            "/images/TrainscafeBanner3.png",
            "/images/TrainscafeBanner4.png",
          ].map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                width={1200}
                height={100}
                style={{ objectFit: "cover", height: "100%", width: "100%" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="px-2 py-4">
        <h1
          style={{
            color: "#704d25",
            fontSize: "1.6rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
          className="text-center"
        >
          Get Your Delicious Meal Online at {stationName} {stationCode}
        </h1>

        <div class="restaurant-heading">
          <div class="railway-img">
            <Image
              alt="railway"
              loading="lazy"
              decoding="async"
              width={100}
              height={100}
              src="/images/Train-icon.png"
            />
          </div>
          <div class="station-detail mt-2">
            <h3 class="station-heading">Restaurants at {stationName}</h3>
          </div>
        </div>

        <VendorCardWithoutTrain selectedStation={selectedStation} />

        <p>
          Order{" "}
          <Link
            className="font-bold text-blue-600 hover:text-blue-800 underline"
            href={`${BASE_URL}/online-food-on-train`}
          >
            {" "}
            food on train{" "}
          </Link>{" "}
          at <strong>{stationName}</strong> Railway Station and receive your
          fresh meal directly at your seat. The station code is{" "}
          <strong>{stationCode}</strong>,and it is one of the important stops
          where Trainscafe delivers delicious, hygienic, and IRCTC-authorized
          meals to railway passengers. All food vendors are IRCTC-approved and
          FSSAI-licensed for safe food delivery.
        </p>

        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#704d25",
            marginTop: "2rem",
          }}
        >
          Serving Hours & Meal Booking Window
        </h2>

        <ul style={{ paddingLeft: "5%", listStyleType: "decimal" }}>
          <li>
            <b>Food Delivery Time:</b> 8:30 AM to 9:30 PM
          </li>
          <li>
            <b>Cut-off Time:</b> 60 to 120 minutes before train arrival
            (depending on restaurant)
          </li>
          <li>
            <b>Currently Serving:</b>450+ trains at {stationName}
          </li>
        </ul>

        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#704d25",
            marginTop: "2rem",
          }}
        >
          👥 Group Food Order Made Easy
        </h2>
        <p>
          Trainscafe offers{" "}
          <Link
            className="font-bold text-blue-600 hover:text-blue-800 underline"
            href={`${BASE_URL}/group-food-order-in-train`}
          >
            bulk food ordering in train
          </Link>{" "}
          for school trips, corporate travel, family tours, and other group
          bookings at {stationName} Station - all at discounted rates. Just a
          few simple steps, and your group gets hot and fresh meals on board.
        </p>

        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#704d25",
            marginTop: "2rem",
          }}
        >
          How to{" "}
          <Link
            className="font-bold text-blue-600 hover:text-blue-800 underline"
            href={`${BASE_URL}/order-food-in-train`}
          >
            {" "}
            Order Food in Train{" "}
          </Link>{" "}
          at {stationName} {stationCode}
        </h2>
        <p>
          Follow these simple steps to get food delivered right to your train
          seat:
        </p>

        <ul style={{ paddingLeft: "5%", listStyleType: "decimal" }}>
          <li>
            Visit{" "}
            <Link
              className="font-bold text-blue-600 hover:text-blue-800 underline"
              href="/"
              
            >
              Trainscafe Website
            </Link>{" "}
            or open the app
          </li>
          <li>
            Enter station name: {stationName} or station code: {stationCode}
          </li>
          <li>Select your preferred restaurant and dish</li>
          <li>Apply available offers or discount codes</li>
          <li>Pay online or choose Cash on Delivery</li>
          <li>
            Get fresh, hot food delivered to your seat at {stationName} Station
          </li>
        </ul>

        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#704d25",
            marginTop: "2rem",
          }}
        >
          Popular Cuisines Available:
        </h2>

        <ul style={{ paddingLeft: "5%", listStyleType: "decimal" }}>
          <li>South Indian</li>
          <li>North Indian</li>
          <li>Chinese</li>
          <li>Mughlai</li>
          <li>Local Specials</li>
        </ul>

        <div
          style={{
            margin: "2rem 0",
            textAlign: "center",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Image
            src="/images/vendor-banner.png"
            alt="Bottom Ad Banner"
            layout="responsive"
            width={728}
            height={90}
          />
        </div>

        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#704d25",
            marginBottom: "1rem",
          }}
        >
          FAQs: Online Food Delivery at {stationName} Station
        </h2>

        <div>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            <li style={{ marginBottom: "14px", fontSize: "14px" }}>
              <strong>Q1:</strong>{" "}
              <strong>
                How to order food online at {stationName} Railway Station?
              </strong>
              <br />
              <strong>Ans.</strong> Visit Trainscafe's official{" "}
              <Link
                className="font-bold text-blue-600 hover:text-blue-800 underline"
                href={`${BASE_URL}/`}
              >
                website
              </Link>{" "}
              or app, select {stationName}, choose your meal, and get it
              delivered to your seat.
            </li>

            <li style={{ marginBottom: "14px", fontSize: "14px" }}>
              <strong>Q2:</strong>{" "}
              <strong>
                Can I call for food delivery in train at {stationName}?
              </strong>
              <br />
              <strong>Ans.</strong> Yes, call{" "}
              <Link
                href="tel:+918696963496"
                className="font-bold text-blue-600 hover:text-blue-800 underline"
              >
                +91-8696963496
              </Link>{" "}
              to place your food order for delivery at {stationName}.
            </li>

            <li style={{ marginBottom: "14px", fontSize: "14px" }}>
              <strong>Q3:</strong>{" "}
              <strong>How to order food in bulk for a group?</strong>
              <br />
              <strong>Ans.</strong> Click on{" "}
              <Link
                className="font-bold text-blue-600 hover:text-blue-800 underline"
                href={`${BASE_URL}/group-food-order-in-train`}
              >
                “Group Order”
              </Link>{" "}
              on the Trainscafe site or call us with your journey details and
              group size.
            </li>

            <li style={{ marginBottom: "14px", fontSize: "14px" }}>
              <strong>Q4:</strong> <strong>Can I pay online?</strong>
              <br />
              <strong>Ans.</strong> Yes, you can pay via UPI, cards, net
              banking, or choose Cash on Delivery (COD).
            </li>

            <li style={{ marginBottom: "14px", fontSize: "14px" }}>
              <strong>Q5:</strong> <strong>Can I use WhatsApp to order?</strong>
              <br />
              <strong>Ans.</strong> Yes, message Trainscafe on WhatsApp at{" "}
              <Link
                href="https://wa.me/918696963496"
                className="font-bold text-blue-600 hover:text-blue-800 underline"
              >
                +91-8696963496
              </Link>{" "}
              to order food for delivery at {stationName}.
            </li>

            <li style={{ marginBottom: "14px", fontSize: "14px" }}>
              <strong>Q6:</strong>{" "}
              <strong>How to become a food vendor at {stationName}?</strong>
              <br />
              <strong>Ans.</strong> Visit the{" "}
              <Link
                className="font-bold text-blue-600 hover:text-blue-800 underline"
                href={`${BASE_URL}/vendor-registration`}
              >
                Restaurant Signup
              </Link>{" "}
              page on Trainscafe or call{" "}
              <Link
                href="tel:+918696963496"
                className="font-bold text-blue-600 hover:text-blue-800 underline"
              >
                +91-8696963496
              </Link>
              .
            </li>
          </ul>
        </div>
        <div>
          <BlogSection />
        </div>
      </div>
    </div>
  );
};

export default StationData;
