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
  dataIndex: "Final_Price",
  key: "Final_Price",
  align: "right",
  render: (_, record) => (
    <span className="whitespace-nowrap">
      ₹ {record.Final_Price ?? record.price}
    </span>
  ),
  width: 100,
},
{
  title: "Amount",
  key: "amount",
  align: "right",
  render: (_, record) => {
    const itemPrice = record.Final_Price ?? record.price;
    return (
      <span className="whitespace-nowrap">₹ {itemPrice * record.quantity}</span>
    );
  },
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
