"use client";

import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useRef, useEffect, useState } from "react";

export default function TotalSection({
  totalAmount = 0,
  gstAmount = 0,
  discount = 0,
  payableAmount = 0,
  isOpen,
  setIsOpen,
}) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="border border-dashed p-4 rounded-md">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-semibold">Total Payment</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">(1 items)</span>
          <span className="font-bold text-lg">
            ₹ {payableAmount?.toFixed(2)}
          </span>
          {isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </div>
      </div>

      {/* Smooth Transition */}
      <div
        ref={contentRef}
        style={{
          maxHeight: `${height}px`,
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        <div className="pt-4 text-sm text-gray-700">
          <div className="flex justify-between py-1 border-b border-dashed">
            <span>Order Amount</span>
            <span>₹ {totalAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-dashed">
            <span>GST</span>
            <span>₹ {gstAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-dashed">
            <span>Delivery Charges</span>
            <span className="text-teal-500">FREE</span>
          </div>
          <div className="flex justify-between py-1 border-b border-dashed">
            <span>Discount</span>
            <span className="text-red-500">₹ {discount?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
