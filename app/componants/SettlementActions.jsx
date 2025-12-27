// "use client";

// import { Button, message, Modal, Typography, Space } from "antd";
// import { useState } from "react";
// import dayjs from "dayjs";

// const { Text } = Typography;

// const formatAmount = (value) =>
//   value !== null && value !== undefined && !isNaN(value)
//     ? Number(value).toFixed(2)
//     : "0.00";

// const formatDate = (date) =>
//   date ? dayjs(date).format("DD-MMM-YYYY") : "-";

// export default function SettlementActions({
//   vendorId,
//   settlement,
//   disablePay,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);

//   const handleConfirmPay = async () => {
//     setConfirmOpen(false);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/settlement/pay", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           vendorId,
//           startDate: settlement.dateRange.startDate,
//           endDate: settlement.dateRange.endDate,
//           settlementAmount: settlement.summary.settlementAmount,
//           settlementStatus: settlement.summary.status,
//         }),
//       });

//       const result = await res.json();
//       if (!result.success) throw new Error(result.message);

//       message.success("Settlement marked as PAID successfully");
//     } catch (err) {
//       message.error(err.message || "Settlement payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (settlement.isPaid) {
//     return <Button disabled>Already Paid</Button>;
//   }

//   return (
//     <>
//       <Space direction="vertical" align="end" size={4}>
//         <Button
//           type="primary"
//           loading={loading}
//           disabled={disablePay}
//           onClick={() => setConfirmOpen(true)}
//           style={{
//             background: "#D6872A",
//             borderColor: "#D6872A",
//             color: "#fff", 
//             fontWeight: 600,
//             height: 36,
//           }}
//         >
//           Pay Settlement
//         </Button>

//         {disablePay && (
//           <Text type="danger" style={{ fontSize: 12 }}>
//             ⚠ This period is already partially or fully settled.
//           </Text>
//         )}
//       </Space>

//       <Modal
//         open={confirmOpen}
//         onCancel={() => setConfirmOpen(false)}
//         onOk={handleConfirmPay}
//         confirmLoading={loading}
//         title="Confirm Settlement Payment"
//         okButtonProps={{
//           style: { background: "#D6872A", borderColor: "#D6872A" },
//         }}
//       >
//         <p>
//           <b>Period:</b>{" "}
//           {formatDate(settlement.dateRange.startDate)} →{" "}
//           {formatDate(settlement.dateRange.endDate)}
//         </p>
//         <p>
//           <b>Amount:</b> ₹
//           {formatAmount(settlement.summary.settlementAmount)}
//         </p>
//         <p style={{ color: "#fa541c" }}>
//           ⚠ This action cannot be undone.
//         </p>
//       </Modal>
//     </>
//   );
// }



"use client";

import { Button, message, Modal, Typography, Space, Divider, Row, Col } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  ShopOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

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
  onSuccess,
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

      if (!result.success) {
        throw new Error(result.message || "Payment failed");
      }

      message.success({
        content: "✓ Settlement marked as PAID successfully",
        duration: 3,
        style: {
          marginTop: "20vh",
        },
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } catch (err) {
      message.error({
        content: err.message || "Settlement payment failed",
        duration: 4,
      });
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (settlement.isPaid) {
    return (
      <Button
        disabled
        size="large"
        icon={<CheckCircleOutlined />}
        style={{
          background: "#f0f0f0",
          borderColor: "#d9d9d9",
          color: "#999",
          height: 44,
          fontWeight: 600,
        }}
      >
        Already Paid
      </Button>
    );
  }

  return (
    <>
      <Space direction="vertical" align="end" size={8} style={{ width: "100%" }}>
        <Button
          type="primary"
          size="large"
          loading={loading}
          disabled={disablePay}
          onClick={() => setConfirmOpen(true)}
          icon={!loading && <DollarOutlined />}
          style={{
            background: disablePay ? undefined : "#D6872A",
            borderColor: disablePay ? undefined : "#D6872A",
            color: disablePay ? undefined : "#fff",
            fontWeight: 700,
            height: 44,
            minWidth: 180,
            fontSize: 15,
            boxShadow: disablePay
              ? "none"
              : "0 4px 12px rgba(214, 135, 42, 0.3)",
          }}
        >
          {loading ? "Processing..." : "Pay Settlement"}
        </Button>

        {disablePay && (
          <Text
            type="danger"
            style={{
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ExclamationCircleOutlined />
            Period already settled
          </Text>
        )}
      </Space>

      <Modal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleConfirmPay}
        confirmLoading={loading}
        width={520}
        centered
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ExclamationCircleOutlined
              style={{ fontSize: 24, color: "#faad14" }}
            />
            <span style={{ fontSize: 18, fontWeight: 700 }}>
              Confirm Settlement Payment
            </span>
          </div>
        }
        okText="Confirm & Pay"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            background: "#D6872A",
            borderColor: "#D6872A",
            height: 40,
            fontWeight: 600,
            fontSize: 15,
          },
          size: "large",
          icon: <CheckCircleOutlined />,
        }}
        cancelButtonProps={{
          size: "large",
          style: { height: 40 },
        }}
      >
        <Divider style={{ margin: "16px 0" }} />

        <div style={{ padding: "8px 0" }}>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  background: "#FFF9E6",
                  borderRadius: 8,
                  border: "1px solid #D6872A",
                }}
              >
                <ShopOutlined style={{ fontSize: 20, color: "#D6872A" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Vendor Name
                  </Text>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {settlement.vendor?.name || "N/A"}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  background: "#E6F7FF",
                  borderRadius: 8,
                  border: "1px solid #91D5FF",
                }}
              >
                <CalendarOutlined style={{ fontSize: 20, color: "#1890FF" }} />
                <div style={{ flex: 1 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Settlement Period
                  </Text>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {formatDate(settlement.dateRange.startDate)} →{" "}
                    {formatDate(settlement.dateRange.endDate)}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div
                style={{
                  padding: 16,
                  background:
                    settlement.summary.status === "Cafe Should Pay"
                      ? "#FFF7E6"
                      : "#FFF1F0",
                  borderRadius: 8,
                  border: `2px solid ${
                    settlement.summary.status === "Cafe Should Pay"
                      ? "#FFD591"
                      : "#FFA39E"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Settlement Amount
                    </Text>
                    <Title
                      level={3}
                      style={{
                        margin: "4px 0 0 0",
                        color:
                          settlement.summary.status === "Cafe Should Pay"
                            ? "#D6872A"
                            : "#CF1322",
                      }}
                    >
                      ₹{formatAmount(Math.abs(settlement.summary.settlementAmount))}
                    </Title>
                  </div>
                  <div
                    style={{
                      padding: "8px 16px",
                      background: "#fff",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 13,
                      color:
                        settlement.summary.status === "Cafe Should Pay"
                          ? "#D6872A"
                          : "#CF1322",
                    }}
                  >
                    {settlement.summary.status}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <div
                style={{
                  padding: 12,
                  background: "#F6FFED",
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Vendor Share
                </Text>
                <div style={{ fontWeight: 600, color: "#52C41A", fontSize: 16 }}>
                  ₹{formatAmount(settlement.summary.vendorShare)}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  padding: 12,
                  background: "#E6F7FF",
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Cafe Net
                </Text>
                <div style={{ fontWeight: 600, color: "#1890FF", fontSize: 16 }}>
                  ₹{formatAmount(settlement.summary.cafeNet)}
                </div>
              </div>
            </Col>
          </Row>

          <div
            style={{
              padding: 12,
              background: "#FFF2E8",
              border: "2px solid #FFBB96",
              borderRadius: 8,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <ExclamationCircleOutlined
              style={{ color: "#FA541C", fontSize: 16, marginTop: 2 }}
            />
            <div>
              <Text strong style={{ color: "#D4380D", display: "block" }}>
                Important Notice
              </Text>
              <Text style={{ fontSize: 13, color: "#AD4E00" }}>
                This action cannot be undone. Please verify all details before
                confirming the payment.
              </Text>
            </div>
          </div>
        </div>

        <Divider style={{ margin: "16px 0 8px 0" }} />
      </Modal>
    </>
  );
} 