"use client";
import React from "react";

const StepSection = () => {
  const steps = [
    {
      title: "Enter your PNR/ Train",
      image: "/images/step-1.png",
    },
    {
      title: "Choose Food You Love",
      image: "/images/step-2.png",
    },
    {
      title: "Place Order Via Online/COD",
      image: "/images/step-3.png",
    },
    {
      title: "Get Food On Your Seat",
      image: "/images/step-4.png",
    },
  ];

  return (
    <div className="max-w-sm mx-auto py-8 mx-auto text-center relative">
      <img
        src="/images/Process.png"
        alt="Process"
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3"
        // style={{top:'24px'}}
      />
      <h2 className="text-2xl font-bold text-[#704D25] mb-6 relative z-10">
        Get Your Food In Easy Steps
      </h2>
      <div className="relative flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative group"
          >
            <div className="relative mb-8">
              <img
                src={step.image}
                alt={step.title}
                className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
              />
              {/* Circle Indicator */}
              <div
                className={`absolute w-3 h-3 rounded-full bg-[#704D25] z-10`}
                style={{
                  left: "50%",
                  bottom: "-20px",
                  transform: "translateX(-50%)",
                }}
              ></div>
            </div>
            <p className="text-[#3A3A3A] font-bold text-xs">{step.title}</p>
          </div>
        ))}

        {/* Dotted Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-full border-t border-dotted border-gray-400 z-0 mt-6"
            style={{ marginTop: "28px" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StepSection;
