"use client";

import {
  Table,
  Tag,
  Button,
  Card,
  Spin,
  message,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const formatDate = (date) =>
  date ? dayjs(date).format("DD-MMM-YYYY") : "-";

const formatAmount = (val) =>
  val !== null && val !== undefined
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
          total: result.pagination.total,
        },
      });
    } catch (error) {
      console.error(error);
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
      render: (_, r) =>
        `${formatDate(r.startDate)} → ${formatDate(r.endDate)}`,
    },
    {
      title: "Amount ₹",
      dataIndex: "settlementAmount",
      align: "right",
      render: (v) => (
        <b>₹{formatAmount(v)}</b>
      ),
    },
    {
      title: "Settlement Status",
      dataIndex: "settlementStatus",
      render: (v) => {
        let color = "green";
        if (v === "Cafe Should Pay") color = "orange";
        if (v === "Cafe Should Receive") color = "red";

        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: "Payment",
      dataIndex: "isPaid",
      render: (v) =>
        v ? (
          <Tag color="green">PAID</Tag>
        ) : (
          <Tag color="red">UNPAID</Tag>
        ),
    },
    {
      title: "Invoice",
      render: (_, r) =>
        r.invoiceUrl ? (
          <Button
            type="link"
            onClick={() => window.open(r.invoiceUrl)}
          >
            Download
          </Button>
        ) : (
          <span style={{ color: "#999" }}>—</span>
        ),
    },
  ];

  return (
    <Card title="Settlement History">
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
