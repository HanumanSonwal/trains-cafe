"use client";

import {
  Table,
  Button,
  DatePicker,
  Spin,
  Tag,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Divider,
  Alert,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SettlementActions from "./SettlementActions";
import {
  CalendarOutlined,
  DollarOutlined,
  ShopOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const cardStyle = {
  borderRadius: "16px",
  backgroundColor: "#FFF9E6",
  border: "2px solid #D6872A",
  boxShadow: "0 6px 16px rgba(214, 135, 42, 0.12)",
  transition: "all 0.3s ease",
};

const headerCardStyle = {
  ...cardStyle,
  background: "linear-gradient(135deg, #FFF9E6 0%, #FFF4D6 100%)",
  borderWidth: "2px",
};

const statCardStyle = {
  ...cardStyle,
  textAlign: "center",
  height: "100%",
};

const formatAmount = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0.00";
  return Number(value).toFixed(2);
};

const formatDate = (date) => {
  if (!date) return "-";
  return dayjs(date).format("DD-MMM-YYYY");
};

export default function SettlementPreview({ vendorId, refreshKey, onRefresh }) {
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settlement, setSettlement] = useState(null);
  const [overlapInfo, setOverlapInfo] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 7,
      showSizeChanger: true,
      pageSizeOptions: ["5", "7", "10", "20"],
      showTotal: (total) =>
        total === 1 ? "1 settlement day" : `${total} settlement days`,
    },
  });

  const fetchSettlement = async () => {
    let url = `/api/settlement/vendor?vendorid=${vendorId}`;
    if (dateRange.length === 2) {
      url += `&startDate=${dateRange[0]}&endDate=${dateRange[1]}`;
    }

    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setSettlement(data);
        setOverlapInfo(data.overlap || null);
      } else {
        setSettlement(data);
        setOverlapInfo(null);
        message.warning(data.message || "No settlement data available");
      }
    } catch (err) {
      message.error("Failed to fetch settlement");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (vendorId) fetchSettlement();
  }, [vendorId, refreshKey]);

  const columns = [
    {
      title: <span style={{ fontWeight: 600 }}>Date</span>,
      dataIndex: "date",
      width: 140,
      render: (v) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CalendarOutlined style={{ color: "#D6872A" }} />
          <b>{formatDate(v)}</b>
        </div>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Online ₹</span>,
      dataIndex: "online",
      align: "right",
      width: 120,
      render: (v) => (
        <span style={{ color: v > 0 ? "#52c41a" : "#999" }}>
          ₹{formatAmount(v)}
        </span>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>COD ₹</span>,
      dataIndex: "cod",
      align: "right",
      width: 120,
      render: (v) => (
        <span style={{ color: v > 0 ? "#1890ff" : "#999" }}>
          ₹{formatAmount(v)}
        </span>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Subtotal ₹</span>,
      dataIndex: "subTotal",
      align: "right",
      width: 130,
      render: (v) => <b style={{ color: "#000" }}>₹{formatAmount(v)}</b>,
    },
    {
      title: <span style={{ fontWeight: 600 }}>Tax ₹</span>,
      dataIndex: "tax",
      align: "right",
      width: 100,
      render: (v) => (
        <span style={{ color: "#ff7a45" }}>₹{formatAmount(v)}</span>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Total ₹</span>,
      dataIndex: "total",
      align: "right",
      width: 130,
      render: (v) => (
        <b style={{ color: "#D6872A", fontSize: 15 }}>₹{formatAmount(v)}</b>
      ),
    },
    {
      title: (
        <span style={{ fontWeight: 600 }}>
          Cafe Share ({settlement?.vendor?.trainscafeCommision ?? 0}%)
        </span>
      ),
      dataIndex: "cafeShare",
      align: "right",
      width: 140,
      render: (v) => (
        <span style={{ color: "#fa541c", fontWeight: 600 }}>
          ₹{formatAmount(v)}
        </span>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Vendor Share ₹</span>,
      dataIndex: "vendorShare",
      align: "right",
      width: 140,
      render: (v) => (
        <span
          style={{
            fontWeight: 700,
            color: "#389e0d",
            fontSize: 15,
          }}
        >
          ₹{formatAmount(v)}
        </span>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Cafe Net ₹</span>,
      dataIndex: "cafeNet",
      align: "right",
      width: 130,
      render: (v) => (
        <span
          style={{
            fontWeight: 700,
            color: "#096dd9",
            fontSize: 15,
          }}
        >
          ₹{formatAmount(v)}
        </span>
      ),
    },
  ];

  const hasDailySettlement =
    Array.isArray(settlement?.dailySettlement) &&
    settlement.dailySettlement.length > 0;

  return (
    <Spin spinning={loading} size="large">
      {/* Header Card with Vendor Info */}
      {settlement?.vendor && (
        <Card style={{ ...headerCardStyle, marginBottom: 24 }} bordered={false}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ShopOutlined
                  style={{ fontSize: 28, color: "#D6872A", opacity: 0.8 }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8c6239",
                      marginBottom: 4,
                    }}
                  >
                    Vendor Name
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#6F4D27",
                    }}
                  >
                    {settlement.vendor.name}
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8}>
              {settlement.dateRange ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CalendarOutlined
                    style={{ fontSize: 24, color: "#D6872A", opacity: 0.8 }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#8c6239",
                        marginBottom: 4,
                      }}
                    >
                      Settlement Period
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#6F4D27",
                      }}
                    >
                      {formatDate(settlement.dateRange.startDate)} →{" "}
                      {formatDate(settlement.dateRange.endDate)}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: "#999", fontStyle: "italic" }}>
                  No pending settlement
                </div>
              )}
            </Col>

            <Col xs={24} sm={12} md={4}>
              {settlement.dateRange && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8c6239",
                      marginBottom: 6,
                    }}
                  >
                    Status
                  </div>
                  <Tag
                    color={settlement.isPaid ? "success" : "warning"}
                    style={{
                      fontSize: 15,
                      padding: "6px 16px",
                      fontWeight: 600,
                      borderRadius: 8,
                    }}
                  >
                    {settlement.isPaid ? "✓ PAID" : "⏳ PENDING"}
                  </Tag>
                </div>
              )}
            </Col>

            <Col xs={24} md={6}>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <RangePicker
                  format="DD-MMM-YYYY"
                  style={{ width: "100%" }}
                  onChange={(dates) =>
                    dates
                      ? setDateRange([
                          dayjs(dates[0]).format("YYYY-MM-DD"),
                          dayjs(dates[1]).format("YYYY-MM-DD"),
                        ])
                      : setDateRange([])
                  }
                />
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{
                    background: "#D6872A",
                    borderColor: "#D6872A",
                    fontWeight: 600,
                    height: 40,
                  }}
                  onClick={fetchSettlement}
                >
                  Apply Date Range
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {settlement?.message && (
        <Alert
          message={settlement.message}
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{
            marginBottom: 20,
            borderRadius: 12,
            border: "2px solid #91d5ff",
            backgroundColor: "#e6f7ff",
          }}
        />
      )}

      {overlapInfo && (
        <Alert
          message="Date Range Conflict"
          description={
            <div>
              <strong>This date range overlaps with a PAID settlement:</strong>
              <div style={{ marginTop: 6 }}>
                {formatDate(overlapInfo.startDate)} →{" "}
                {formatDate(overlapInfo.endDate)}
              </div>
            </div>
          }
          type="error"
          showIcon
          style={{
            marginBottom: 20,
            borderRadius: 12,
            border: "2px solid #ff4d4f",
          }}
        />
      )}

      {settlement?.summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[
            {
              title: "Online Total",
              value: settlement.summary.onlineAmount,
              icon: <DollarOutlined />,
              color: "#52c41a",
            },
            {
              title: "COD Total",
              value: settlement.summary.codAmount,
              icon: <DollarOutlined />,
              color: "#1890ff",
            },
            {
              title: "Vendor Share",
              value: settlement.summary.vendorShare,
              icon: <DollarOutlined />,
              color: "#389e0d",
            },
            {
              title: "Tax Amount",
              value: settlement.summary.tax,
              icon: <DollarOutlined />,
              color: "#ff7a45",
            },
            {
              title: "Cafe Share",
              value: settlement.summary.cafeShare,
              icon: <DollarOutlined />,
              color: "#fa541c",
            },
            {
              title: "Cafe Net",
              value: settlement.summary.cafeNet,
              icon: <DollarOutlined />,
              color: "#096dd9",
            },
          ].map(({ title, value, icon, color }) => (
            <Col xs={12} sm={8} md={4} key={title}>
              <Card style={statCardStyle} hoverable>
                <Statistic
                  title={
                    <span style={{ fontSize: 13, color: "#8c6239" }}>
                      {title}
                    </span>
                  }
                  value={formatAmount(value)}
                  prefix="₹"
                  valueStyle={{
                    color: color,
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {hasDailySettlement && (
        <Card
          style={{ ...cardStyle, marginBottom: 24 }}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarOutlined style={{ fontSize: 18, color: "#D6872A" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>
                Daily Settlement Breakdown
              </span>
            </div>
          }
          headStyle={{
            background: "linear-gradient(135deg, #FFF4D6 0%, #FFEDCC 100%)",
            borderBottom: "2px solid #D6872A",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <Table
            columns={columns}
            dataSource={settlement.dailySettlement}
            pagination={tableParams.pagination}
            rowKey="date"
            scroll={{ x: 1200 }}
            size="middle"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
          <style jsx global>{`
            .table-row-light {
              background-color: #fffbf0;
            }
            .table-row-dark {
              background-color: #fff9e6;
            }
            .ant-table-thead > tr > th {
              background: #fff4d6 !important;
              color: #6f4d27 !important;
              font-weight: 600 !important;
              border-bottom: 2px solid #d6872a !important;
            }
          `}</style>
        </Card>
      )}

      {settlement?.summary && hasDailySettlement && (
        <>
          <Divider style={{ borderColor: "#D6872A", borderWidth: 2 }} />

          <Card
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #FFF9E6 0%, #FFF0CC 100%)",
            }}
          >
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <Tag
                    color={
                      settlement.summary.status === "Cafe Should Pay"
                        ? "orange"
                        : settlement.summary.status === "Cafe Should Receive"
                        ? "red"
                        : "green"
                    }
                    style={{
                      fontSize: 16,
                      padding: "10px 20px",
                      fontWeight: 700,
                      borderRadius: 10,
                      border: "2px solid",
                    }}
                  >
                    {settlement.summary.status === "Cafe Should Pay"
                      ? `💰 Cafe pays ₹${formatAmount(
                          Math.abs(settlement.summary.settlementAmount)
                        )} to vendor`
                      : `💵 Cafe receives ₹${formatAmount(
                          Math.abs(settlement.summary.settlementAmount)
                        )} from vendor`}
                  </Tag>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#8c6239",
                      fontStyle: "italic",
                    }}
                  >
                    {settlement.summary.status === "Cafe Should Pay"
                      ? "(COD collected exceeds online payments)"
                      : "(Online payments exceed COD collected)"}
                  </div>
                </div>
              </Col>

              <Col xs={24} md={8} style={{ textAlign: "right" }}>
                <SettlementActions
                  vendorId={vendorId}
                  settlement={settlement}
                  disablePay={!!overlapInfo}
                  onSuccess={onRefresh}
                />
              </Col>
            </Row>
          </Card>
        </>
      )}

      {!hasDailySettlement && settlement && !loading && (
        <Card
          style={{
            ...cardStyle,
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📊</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#8c6239" }}>
            No Settlement Data Available
          </div>
          <div style={{ fontSize: 14, color: "#999", marginTop: 8 }}>
            {settlement.message || "Try selecting a different date range"}
          </div>
        </Card>
      )}
    </Spin>
  );
}
