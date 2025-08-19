"use client";

import React from "react";
import Link from "next/link";

export default function MenuContent({ categories }) {
  const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";
  return (
    <div>
      <h2
        className="font-bold"
        style={{
          marginTop: "2rem",
          color: "#704d25",
        }}
      >
        Order{" "}
        <Link
          className="font-bold text-blue-600 hover:text-blue-800 underline"
          href={`${BASE_URL}`}          
        >
          {" "}
          food in train{" "}
        </Link>{" "}
        from{" "}
        <strong>
          {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
        </strong>{" "}
        at{" "}
        <strong>
          {categories.length > 0 ? categories[0].station : "N/A"}
        </strong>{" "}
        with Trainscafe
      </h2>
      <p className="py-2">
        Experience delicious, hygienic, and on-time food delivery in train
        from{" "}
        <strong>
          {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
        </strong>{" "}
        at{" "}
        <strong>
          {categories.length > 0 ? categories[0].station : "N/A"}
        </strong>{" "}
        through Trainscafe – India’s trusted train food delivery partner.
      </p>
      <p className="py-2">
        Trainscafe delivers fresh meals directly to your train seat with
        E-catering partnership. Whether you're craving a light snack or a full
        meal,{" "}
        <strong>
          {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
        </strong>{" "}
        at{" "}
        <strong>
          {categories.length > 0 ? categories[0].station : "N/A"}
        </strong>{" "}
        station is ready to serve passengers traveling across India with a
        multiple varieties range of food.
      </p>

      <h2
        className="font-bold mb-2"
        style={{
          color: "#704d25",
          marginTop: "2rem",
        }}
      >
        Why Choose Trainscafe for{" "}
        <Link
          className="font-bold text-blue-600 hover:text-blue-800 underline"
          href={`${BASE_URL}/online-train-food-delivery`}
        >
          {" "}
          Online Train Food Delivery?{" "}
        </Link>
      </h2>
      <ul style={{ paddingLeft: "5%", listStyleType: "disc" }}>
        <li>
          <b>Expertise in Train Catering :</b> With years of experience in
          railway food delivery services, Trainscafe ensures every meal is
          prepared with care and delivered with precision.
        </li>
        <li>
          <b>Trusted by Thousands :</b> Daily serving 500+ trains and
          thousands of passengers across major Indian railway stations.
        </li>
        <li>
          <b>Real-time Tracking & Support :</b> Know when your food is being
          prepared, dispatched, and delivered with real-time updates.
        </li>
      </ul>

      <div>
        <h2
          className="font-bold"
          style={{
            marginTop: "2rem",
            color: "#704d25",
          }}
        >
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "}
          Railway Station
        </h2>
        <p className="py-2">
          Trainscafe has tied up with{" "}
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          to provide on-seat train food delivery at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>
          .
          <br />
          Whether you’re traveling alone or with family, or need group meal
          booking in train, Trainscafe ensures a smooth, satisfying food
          experience right at your berth.
        </p>
      </div>

      <div>
        <h2
          className="font-bold"
          style={{
            marginTop: "2rem",
            color: "#704d25",
          }}
        >
          How to{" "}
          <Link
            className="font-bold text-blue-600 hover:text-blue-800 underline"
            href={`${BASE_URL}/order-food-in-train`}
          >
            {" "}
            Order Food Online in Train{" "}
          </Link>{" "}
          from{" "}
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "}
          ?
        </h2>
        <h4 className="py-2">
          Order your favorite food on train is just a few simple steps away
        </h4>
        <ul style={{ paddingLeft: "5%", listStyleType: "decimal" }}>
          <li>
            Visit <b>Trainscafe Web App</b> or use our <b>Whatsapp</b>
          </li>
          <li>
            Enter Train no. / station name or PNR number (e.g.,{" "}
            <strong>
              {categories.length > 0 ? categories[0].station : "N/A"}
            </strong>
            )
          </li>
          <li>
            Choose{" "}
            <strong>
              {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
            </strong>{" "}
            from the list of available restaurants
          </li>
          <li>Select dishes from the displayed food menu</li>
          <li>Apply promo codes if available</li>
          <li>Pay online securely or choose <b>Cash on Delivery</b></li>
          <li>
            Your food will be delivered directly to your train seat at{" "}
            <strong>
              {categories.length > 0 ? categories[0].station : "N/A"}
            </strong>{" "}
            station
          </li>
        </ul>
      </div>

      <div>
        <h2
          className="font-bold"
          style={{
            marginTop: "2rem",
            color: "#704d25",
          }}
        >
          👨‍👩‍👧‍👦 Bulk Order Facility in Train
        </h2>
        <p className="py-2">
          Traveling in a group? Trainscafe provides bulk food ordering for group
          train journeys from{" "}
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>
          . Ideal for school trips, tour groups, and corporate teams, etc. ✅
          Custom Menus | ✅ Best Prices | ✅ Timely Delivery | ✅ PAN-India
          Station Coverage
        </p>
        <h5 className="py-2 font-bold">
          Need Help with Your Train Food Order?
        </h5>
        <p className="py-2">
          Call us on{" "}
          <Link
            href="tel:+918696963496"
            className="font-bold text-blue-600 hover:text-blue-800 underline"
          >
            +91-8696963496
          </Link>{" "}
          or WhatsApp{" "}
          <Link
            href="https://wa.me/918696963496"
            className="font-bold text-blue-600 hover:text-blue-800 underline"
          >
            +91-8696963496
          </Link>{" "}
          your order for{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "}
          delivery. Our customer care is available from 8:00 AM to 10:00 PM, all
          days.
        </p>
      </div>
    </div>
  );
}
