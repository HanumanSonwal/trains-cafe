"use client";

import { useEffect, useState } from "react";

export default function MaintenancePage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 overflow-hidden">
      <div className="max-w-lg w-full text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-sm tracking-widest text-yellow-400 mb-3">
          ✦ TrainCafe ✦
        </h2>

        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Under Maintenance
        </h1>

        <p className="text-gray-400 mb-6">
          We’re working on something awesome. Please check back soon.
        </p>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
          <div className="h-2 bg-yellow-400 animate-pulse w-3/4"></div>
        </div>

        <div className="bg-white/10 rounded-lg py-3 mb-6">
          <p className="text-xs text-gray-400">Current Time</p>
          <p className="text-lg font-semibold">{time || "Loading..."}</p>
        </div>

        <p className="text-xs text-gray-500">Thanks for your patience ❤️</p>
      </div>
    </div>
  );
}
