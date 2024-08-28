// components/InvoiceManagement.js
"use client";
import React from 'react';
import { Table } from 'antd';

const initialInvoices = [
  { key: '1', vendor: 'Vendor A', amount: 1000, dueDate: '2024-09-01', status: 'Pending' },
  { key: '2', vendor: 'Vendor B', amount: 2000, dueDate: '2024-09-10', status: 'Paid' },
  // Add more invoices here
];

const InvoiceManagement = ({ vendorKey }) => {
  const vendorInvoices = initialInvoices.filter(invoice => invoice.vendor === vendorKey);

  const invoiceColumns = [
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <Table
      columns={invoiceColumns}
      dataSource={vendorInvoices}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default InvoiceManagement;
