"use client";

import { Table } from "antd";

export default function ItemTable({ items }) {
  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-800 whitespace-nowrap">
          {text}
        </span>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 70,
      render: (qty) => <span className="whitespace-nowrap">{qty}</span>,
    },
    {
      title: "Price",
      dataIndex: "finalPrice",
      key: "finalPrice",
      align: "right",
      render: (finalPrice) => (
        <span className="whitespace-nowrap">{`₹ ${finalPrice}`}</span>
      ),
      width: 100,
    },
    {
      title: "Amount",
      key: "amount",
      align: "right",
      render: (_, record) => (
        <span className="whitespace-nowrap">{`₹ ${
          record.finalPrice * record.quantity
        }`}</span>
      ),
      width: 120,
    },
  ];

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <Table
        dataSource={items}
        columns={columns}
        rowKey={(record, index) => index}
        pagination={false}
        size="middle"
        className="mb-4"
        scroll={{ x: true }}
        style={{ width: "100%", minWidth: "auto" }}
      />
    </div>
  );
}
