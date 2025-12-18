"use client";

import { Button, message, Modal } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const formatAmount = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0.00";
  return Number(value).toFixed(2);
};

const formatDate = (date) => {
  if (!date) return "-";
  return dayjs(date).format("DD-MMM-YYYY");
};

export default function SettlementActions({
  vendorId,
  settlement,
  disablePay,
}) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmPay = async () => {
    setConfirmOpen(false);
    setLoading(true);

    try {
      const payRes = await fetch("/api/settlement/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          startDate: settlement.dateRange.startDate,
          endDate: settlement.dateRange.endDate,

          onlineAmount: settlement.summary.onlineAmount,
          codAmount: settlement.summary.codAmount,
          vendorShare: settlement.summary.vendorShare,
          cafeShare: settlement.summary.cafeShare,
          tax: settlement.summary.tax,
          cafeNet: settlement.summary.cafeNet,

          settlementAmount: settlement.summary.settlementAmount,
          settlementStatus: settlement.summary.status,
        }),
      });

      const result = await payRes.json();

      if (!result.success) {
        throw new Error(result.message || "Payment failed");
      }

      message.success("Settlement marked as PAID successfully");
    } catch (error) {
      message.error(error.message || "Settlement payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (settlement.isPaid) {
    return <Button disabled>Already Paid</Button>;
  }

  return (
    <>
      <Button
        type="primary"
        disabled={disablePay}
        loading={loading}
        onClick={() => setConfirmOpen(true)}
      >
        Pay Settlement
      </Button>

      {disablePay && (
        <div style={{ color: "#fa541c", marginTop: 6 }}>
          ⚠ This period is already partially or fully settled.
        </div>
      )}

      <Modal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleConfirmPay}
        okText="Yes, Mark as Paid"
        cancelText="Cancel"
        confirmLoading={loading}
        title="Confirm Settlement Payment"
      >
        <p>
          <b>Vendor:</b> {settlement.vendor.name}
        </p>
        <p>
          <b>Period:</b>{" "}
          {formatDate(settlement.dateRange.startDate)} →{" "}
          {formatDate(settlement.dateRange.endDate)}
        </p>
        <p>
          <b>Amount:</b> ₹
          {formatAmount(settlement.summary.settlementAmount)}
        </p>
        <p style={{ color: "#fa541c", marginTop: 12 }}>
          ⚠ This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
