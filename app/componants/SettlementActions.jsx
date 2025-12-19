"use client";

import { Button, message, Modal, Typography, Space } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const { Text } = Typography;

const formatAmount = (value) =>
  value !== null && value !== undefined && !isNaN(value)
    ? Number(value).toFixed(2)
    : "0.00";

const formatDate = (date) =>
  date ? dayjs(date).format("DD-MMM-YYYY") : "-";

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
      const res = await fetch("/api/settlement/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          startDate: settlement.dateRange.startDate,
          endDate: settlement.dateRange.endDate,
          settlementAmount: settlement.summary.settlementAmount,
          settlementStatus: settlement.summary.status,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      message.success("Settlement marked as PAID successfully");
    } catch (err) {
      message.error(err.message || "Settlement payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (settlement.isPaid) {
    return <Button disabled>Already Paid</Button>;
  }

  return (
    <>
      <Space direction="vertical" align="end" size={4}>
        <Button
          type="primary"
          loading={loading}
          disabled={disablePay}
          onClick={() => setConfirmOpen(true)}
          style={{
            background: "#D6872A",
            borderColor: "#D6872A",
            color: "#fff", 
            fontWeight: 600,
            height: 36,
          }}
        >
          Pay Settlement
        </Button>

        {disablePay && (
          <Text type="danger" style={{ fontSize: 12 }}>
            ⚠ This period is already partially or fully settled.
          </Text>
        )}
      </Space>

      <Modal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleConfirmPay}
        confirmLoading={loading}
        title="Confirm Settlement Payment"
        okButtonProps={{
          style: { background: "#D6872A", borderColor: "#D6872A" },
        }}
      >
        <p>
          <b>Period:</b>{" "}
          {formatDate(settlement.dateRange.startDate)} →{" "}
          {formatDate(settlement.dateRange.endDate)}
        </p>
        <p>
          <b>Amount:</b> ₹
          {formatAmount(settlement.summary.settlementAmount)}
        </p>
        <p style={{ color: "#fa541c" }}>
          ⚠ This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
