"use client";

import { Table } from "antd";
export default function ItemTable({ items }) {
  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    { title: "Qty", dataIndex: "quantity", key: "quantity", align: "center" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => `₹ ${price}`,
    },
    {
      title: "Amount",
      key: "amount",
      align: "right",
      render: (_, record) => `₹ ${record.price * record.quantity}`,
    },
  ];

  return (
    <Table
      dataSource={items}
      columns={columns}
      rowKey={(record, index) => index}
      pagination={false}
      size="middle"
      className="mb-4"
    />
  );
}
