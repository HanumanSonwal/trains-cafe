"use client";

import { Table, Tag, Button, Card, Spin, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const cardStyle = {
  borderRadius: "14px",
  backgroundColor: "#FFF9E6",
  border: "1.5px solid #D6872A",
  height: "100%",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const formatDate = (date) => (date ? dayjs(date).format("DD-MMM-YYYY") : "-");

const formatAmount = (val) =>
  val !== null && val !== undefined && !isNaN(val)
    ? Number(val).toFixed(2)
    : "0.00";

export default function SettlementHistory({ vendorId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20"],
      showTotal: (total) => `Total ${total} settlements`,
    },
  });

  const fetchHistory = async (pagination = tableParams.pagination) => {
    if (!vendorId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/settlement/history?vendorid=${vendorId}&page=${pagination.current}&limit=${pagination.pageSize}`
      );

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setData(result.data || []);
      setTableParams({
        pagination: {
          ...pagination,
          total: result.pagination?.total || 0,
        },
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to load settlement history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [vendorId]);

  const handleTableChange = (pagination) => {
    fetchHistory(pagination);
  };

  const columns = [
    {
      title: "Settlement Period",
      render: (_, r) => (
        <b>
          {formatDate(r.startDate)} → {formatDate(r.endDate)}
        </b>
      ),
    },
    {
      title: "Amount ₹",
      dataIndex: "settlementAmount",
      align: "right",
      render: (v) => <b>₹{formatAmount(v)}</b>,
    },
    {
      title: "Settlement Status",
      dataIndex: "settlementStatus",
      render: (v) => {
        let color = "green";
        if (v === "Cafe Should Pay") color = "orange";
        if (v === "Cafe Should Receive") color = "red";

        return (
          <Tag color={color} style={{ fontWeight: 500 }}>
            {v}
          </Tag>
        );
      },
    },
    {
      title: "Payment",
      dataIndex: "isPaid",
      render: (v) =>
        v ? <Tag color="green">PAID</Tag> : <Tag color="red">UNPAID</Tag>,
    },
   {
  title: "Invoice",
  align: "center",
  render: (_, r) => (
    <Button
  type="link"
  style={{ color: "#D6872A", fontWeight: 500 }}
  onClick={async () => {
    try {
      const res = await fetch("/api/settlement/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorName: "Vendor", // fallback
          startDate: formatDate(r.startDate),
          endDate: formatDate(r.endDate),
          settlementAmount: r.settlementAmount,
          settlementStatus: r.settlementStatus,
        }),
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "vendor_settlement_invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      message.error("Failed to download invoice");
    }
  }}
>
  Download
</Button>

  ),
}

  ];

  return (
    <Card
      title="Settlement History"
      style={cardStyle}
      headStyle={{ fontWeight: 600 }}
    >
      <Spin spinning={loading}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          locale={{
            emptyText: "No settlement history found",
          }}
        />
      </Spin>
    </Card>
  );
}
