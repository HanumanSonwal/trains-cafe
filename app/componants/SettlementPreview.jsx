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
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SettlementActions from "./SettlementActions";

const { RangePicker } = DatePicker;

const cardStyle = {
  borderRadius: "14px",
  backgroundColor: "#FFF9E6",
  border: "1.5px solid #D6872A",
  height: "100%",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const formatAmount = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0.00";
  return Number(value).toFixed(2);
};

const formatDate = (date) => {
  if (!date) return "-";
  return dayjs(date).format("DD-MMM-YYYY");
};

export default function SettlementPreview({ vendorId }) {
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
        setSettlement(null);
        setOverlapInfo(null);
        message.error(data.message || "No settlement found");
      }
    } catch {
      message.error("Settlement fetch failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (vendorId) fetchSettlement();
  }, [vendorId]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (v) => <b>{formatDate(v)}</b>,
    },
    {
      title: "Online ₹",
      dataIndex: "online",
      align: "right",
      render: (v) => `₹${formatAmount(v)}`,
    },
    {
      title: "COD ₹",
      dataIndex: "cod",
      align: "right",
      render: (v) => `₹${formatAmount(v)}`,
    },
    {
      title: "Total ₹",
      dataIndex: "total",
      align: "right",
      render: (v) => (
        <span style={{ fontWeight: 600 }}>₹{formatAmount(v)}</span>
      ),
    },
  ];

  const hasDailySettlement =
    Array.isArray(settlement?.dailySettlement) &&
    settlement.dailySettlement.length > 0;

  return (
    <Spin spinning={loading}>
      {settlement?.vendor && (
        <Card style={{ ...cardStyle, marginBottom: 20 }} bordered={false}>
          <Row gutter={24} align="middle">
            <Col span={5}>
              <Statistic title="Vendor Name" value={settlement.vendor.name} />
            </Col>

            <Col span={7}>
              <Statistic
                title="Settlement Period"
                value={`${formatDate(
                  settlement.dateRange.startDate
                )} → ${formatDate(settlement.dateRange.endDate)}`}
              />
            </Col>

            <Col span={4}>
              <Tag
                color={settlement.isPaid ? "green" : "orange"}
                style={{ fontSize: 14, padding: "4px 10px" }}
              >
                {settlement.isPaid ? "PAID" : "PENDING"}
              </Tag>
            </Col>

            <Col span={8}>
              <Space>
                <RangePicker
                  format="DD-MMM-YYYY"
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
                  style={{ background: "#D6872A" }}
                  onClick={fetchSettlement}
                >
                  Apply
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {overlapInfo && (
        <Card style={{ ...cardStyle, marginBottom: 16 }}>
          <Tag color="red">⚠ Date range overlaps with PAID settlement</Tag>
          <div style={{ marginTop: 6 }}>
            <b>
              {formatDate(overlapInfo.startDate)} →{" "}
              {formatDate(overlapInfo.endDate)}
            </b>
          </div>
        </Card>
      )}

      {settlement?.summary && (
        <Row gutter={16} style={{ marginBottom: 20 }}>
          {[
            ["Online Total", settlement.summary.onlineAmount],
            ["COD Total", settlement.summary.codAmount],
            ["Vendor Share", settlement.summary.vendorShare],
            ["Cafe Net", settlement.summary.cafeNet],
          ].map(([title, value]) => (
            <Col span={6} key={title}>
              <Card style={cardStyle}>
                <Statistic
                  title={title}
                  prefix="₹"
                  value={formatAmount(value)}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {hasDailySettlement && (
        <Card
          style={{ ...cardStyle, marginBottom: 20 }}
          title="Daily Settlement"
        >
          <Table
            columns={columns}
            dataSource={settlement.dailySettlement}
            pagination={tableParams.pagination}
            rowKey="date"
          />
        </Card>
      )}

      {settlement?.summary && hasDailySettlement && (
        <>
          <Divider />

          <Card style={cardStyle}>
            <Row justify="space-between" align="middle">
              <Col>
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
                    padding: "8px 16px",
                    fontWeight: 600,
                  }}
                >
                  {settlement.summary.status === "Cafe Should Pay"
                    ? `Cafe needs to pay ₹${formatAmount(
                        settlement.summary.settlementAmount
                      )} to vendor`
                    : `Cafe will receive ₹${formatAmount(
                        settlement.summary.settlementAmount
                      )}`}
                </Tag>
              </Col>

              <Col>
                <SettlementActions
                  vendorId={vendorId}
                  settlement={settlement}
                  disablePay={!!overlapInfo}
                />
              </Col>
            </Row>
          </Card>
        </>
      )}
    </Spin>
  );
}
