import React from "react";
import { Button } from "antd";
import Link from "next/link";

const AboutUsPage = () => {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative md:h-60 h-40 mb-4">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold">
            About Us
          </h1>
        </div>
      </div>

      {/* About Us Content */}
      <div className="relative max-w-4xl mx-auto p-6 bg-white shadow-lg z-10">
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-sm mb-4 text-justify">
            Welcome to TrainCafe, your go-to online food delivery service for
            train passengers. Our mission is to provide a seamless experience of
            ordering delicious meals and having them delivered directly to your
            seat, making your journey more enjoyable.
          </p>

          {/* Company Background and Mission */}
          <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
          <p className="text-sm mb-4 text-justify">
            At TrainCafe, our mission is to revolutionize train travel by
            offering passengers the convenience of ordering quality food from a
            variety of vendors, all from the comfort of their seats. We aim to
            enhance the travel experience with delicious, timely, and reliable
            service.
          </p>

          {/* Vision */}
          <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
          <p className="text-sm mb-4 text-justify">
            Our vision is to become the leading food delivery service for train
            passengers across the country, known for our dedication to quality,
            service, and innovation. We envision a future where every train
            journey is complemented by delightful dining options.
          </p>

          {/* History */}
          <h3 className="text-xl font-semibold mb-3">Our History</h3>
          <p className="text-sm mb-4 text-justify">
            Founded in [Year], TrainCafe was born out of a desire to address the
            lack of quality food options for train passengers. We started with a
            small team of passionate individuals and have grown into a trusted
            service provider with a wide network of vendors and satisfied
            customers.
          </p>

          {/* Team */}
          <h3 className="text-xl font-semibold mb-3">Our Team</h3>
          <p className="text-sm mb-4 text-justify">
            Our team is made up of dedicated professionals who share a passion
            for food and service. From our customer service representatives to
            our delivery partners, everyone at TrainCafe is committed to making
            your travel experience better.
          </p>

          {/* Partnerships */}
          <h3 className="text-xl font-semibold mb-3">
            Partnerships with Vendors
          </h3>
          <p className="text-sm mb-4 text-justify">
            We are proud to partner with some of the best food vendors in the
            industry, ensuring that our customers have access to a wide range of
            delicious and hygienic meal options. Our partnerships allow us to
            bring you the best food, right to your train seat.
          </p>

          {/* Call to Action */}
          <Link href="/contactus" passHref>
            <Button type="btn" className="order-btn">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
