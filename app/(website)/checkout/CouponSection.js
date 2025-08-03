"use client";

import { useState } from "react";
import { Input, Button, message, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";

export default function CouponSection({
  email,
  mobile,
  items = [],
  onDiscountChange,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return message.warning("Please enter a coupon code");
    if (!email || !mobile) {
      return message.error("Please fill in email and mobile before applying coupon.");
    }

    setLoading(true);
    try {
      const response = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          email,
          phone: `+91${mobile}`,
          cart: items,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onDiscountChange(result.discount);
        setIsCouponApplied(true);
        setCouponError(false);
        message.success("Coupon applied successfully!");
      } else {
        throw new Error(result.message || "Invalid coupon");
      }
    } catch (error) {
      setCouponError(true);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setIsCouponApplied(false);
    setCouponError(false);
    onDiscountChange(0);
    message.info("Coupon removed.");
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mt-4">
      <CSSTransition
        in={isCouponApplied}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="flex justify-between items-center">
          <span className="text-green-700 font-medium">
            ✅ Coupon applied:{" "}
            <span className="bg-green-100 px-2 py-1 rounded">
              {couponCode}
            </span>
          </span>
          <Tooltip title="Remove Coupon">
            <Button
              type="text"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={handleRemoveCoupon}
              style={{
                border: "1px solid #d94d1a",
                color: "#d94d1a",
              }}
              className="hover:!bg-[#fff1ec] transition-all"
            />
          </Tooltip>
        </div>
      </CSSTransition>

      {!isCouponApplied && (
        <Input
          placeholder="COUPON CODE"
          className="mb-2"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            setCouponError(false);
          }}
          suffix={
            <Button
              danger={couponError}
              className="!px-3 !py-1 text-sm font-medium"
              style={{
                backgroundColor: "#D49929",
                borderColor: "#D49929",
                color: "#fff",
              }}
              loading={loading}
              onClick={handleApplyCoupon}
            >
              Apply
            </Button>
          }
        />
      )}

      {couponError && (
        <span className="text-red-500 text-sm">❌ Invalid coupon code.</span>
      )}
    </div>
  );
}
