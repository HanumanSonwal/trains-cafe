"use client";

import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useRef, useEffect, useState } from "react";

export default function TotalSection({
  totalAmount = 0,
  gstAmount = 0,
  discount = 0,
  payableAmount = 0,
  totalItem,
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
        className="flex justify-between items-center cursor-pointer flex-wrap"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-semibold text-sm sm:text-base">Total Payment</div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            ({totalItem} items)
          </span>
          <span className="font-bold text-base sm:text-lg whitespace-nowrap">
            ₹ {payableAmount?.toFixed(2)}
          </span>
          {isOpen ? (
            <CaretUpOutlined style={{ fontSize: "1rem" }} />
          ) : (
            <CaretDownOutlined style={{ fontSize: "1rem" }} />
          )}
        </div>
      </div>

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
            <span className="text-sm">₹ {totalAmount?.toFixed(2)}</span>
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
