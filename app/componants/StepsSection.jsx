"use client";
import React from "react";

const StepSection = () => {
  const steps = [
    {
      title: "Enter Your Train/PNR",
      image: "/images/step-1.png",
    },
    {
      title: "Pick Your Favourite Meals",
      image: "/images/step-2.png",
    },
    {
      title: "Pay Online or COD",
      image: "/images/step-3.png",
    },
    {
      title: "Enjoy Fresh Food at Your Seat",
      image: "/images/step-4.png",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center relative">
      <img
        src="/images/Process.png"
        alt="Process"
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3"
      />

      <h2 className="text-2xl sm:text-3xl font-bold text-[#704D25] mb-10 relative z-10">
        Get Your Food In Easy Steps
      </h2>

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white shadow-md rounded-xl p-4 transition duration-300 hover:shadow-xl"
          >
            <img
              src={step.image}
              alt={step.title}
              className="h-24 mb-3 transition-transform duration-300 group-hover:scale-110"
            />
            <p className="text-xs sm:text-sm font-semibold text-[#3A3A3A]">
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSection;
