"use client";
import React from "react";

const GlobalLoader = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-white/70 z-[9999] flex justify-center items-center">
      <div className="loader"></div>
    </div>
  );
};

export default GlobalLoader;
