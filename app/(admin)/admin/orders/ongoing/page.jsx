"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, DatePicker, Select, Input, Space, Tag } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import CreateOrderModal from "../CreateOrderModal";


const { RangePicker } = DatePicker;
const { Option } = Select;

const OrdersTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "pending",
    startDate: null,
    endDate: null,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const { status, startDate, endDate } = filters;
      const start = startDate ? `&startDate=${startDate}` : "";
      const end = endDate ? `&endDate=${endDate}` : "";
      const statusQuery = status && status !== "All" ? `&status=${status}` : "";
      const response = await fetch(
        `/api/orders?page=${page}&limit=${limit}${statusQuery}${start}${end}`
      );
      const result = await response.json();

      if (result.success) {
        const mappedData = result.docs.map((order) => ({
          orderID: order._id,
          date: new Date(order.createdAt || order.updatedAt).toLocaleString(),
          admin: "Admin",
          vendor: order?.Vendor_Name || "N/A",
          amount: order?.total || 0,
          subTotal: order?.subTotal || 0,
          tax: order?.payment?.tax || 0,
          couponAmount: order?.couponAmount || 0,
          contact: order?.user_details?.mobile || "N/A",
          altContact: order?.user_details?.alternateMobile || "N/A",
          details: `SubTotal: ₹${order?.subTotal || 0} | Tax: ₹${order?.payment?.tax || 0} | Coupon: ₹${order?.couponAmount || 0} | Total: ₹${order?.total || 0}`,
          deliveryDetails: {
            name: order?.user_details?.name || "N/A",
            mobile: order?.user_details?.mobile || "N/A",
            altMobile: order?.user_details?.alternateMobile || "N/A",
            trainNo: order?.user_details?.trainNo || "N/A",
            pnr: order?.user_details?.pnr || "N/A",
            coach: order?.user_details?.coach || "N/A",
            seatNo: order?.user_details?.seatNo || "N/A",
            instructions: order?.user_details?.instructions || "N/A",
            station: order?.stationDetails?.Station_Name || "N/A",
            deliveryTime: "TBD",
          },
          status: order?.status || "Pending",
          paymentStatus: order?.payment?.payment_status || "N/A",
          paymentMethod: order?.payment?.payment_method || "N/A",
        }));

        setDataSource(mappedData);
        setTotalPages(result.totalPages);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [filters, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
      render: (text, record) => (
        <>
          <p>{`(${record.date})`}</p>
          <p>{text}</p>
          <p>({record.admin})</p>
        </>
      ),
    },
    {
      title: "Order Details",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <div>
          <p><strong>Vendor:</strong> {text}</p>
          <p><strong>Contact:</strong> {record.contact} | {record.altContact}</p>
          <p><strong>SubTotal:</strong> ₹{record.subTotal} | <strong>Tax:</strong> ₹{record.tax} | <strong>Coupon:</strong> -₹{record.couponAmount}</p>
          <p><strong>Total:</strong> ₹{record.amount}</p>
        </div>
      ),
    },
    {
      title: "Delivery Details",
      dataIndex: "deliveryDetails",
      key: "deliveryDetails",
      render: (details) => (
        <div>
          <p><strong>Name:</strong> {details.name}</p>
          <p><strong>Mobile:</strong> {details.mobile} | {details.altMobile}</p>
          <p><strong>Train No:</strong> {details.trainNo}</p>
          <p><strong>PNR:</strong> {details.pnr}</p>
          <p><strong>Coach:</strong> {details.coach} | <strong>Seat:</strong> {details.seatNo}</p>
          <p><strong>Instructions:</strong> {details.instructions}</p>
          <p><strong>Station:</strong> {details.station}</p>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <div>
          <p><strong>Net Total:</strong> ₹{amount}</p>
          <p><strong>Tax:</strong> ₹{record.tax}</p>
          <p><strong>Coupon:</strong> -₹{record.couponAmount}</p>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Space>
          <Tag color={status === "pending" ? "orange" : "green"}>{status}</Tag>
          <Button type="link">Change</Button>
        </Space>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text, record) => (
        <Space>
          <Tag color="blue">{record.paymentStatus}</Tag>
          <Tag color="purple">{record.paymentMethod}</Tag>
          <Button type="link">Change</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="orders-table">
      <div className="filters flex justify-between mb-4">
        <div className="flex space-x-4">
          <RangePicker
            onChange={(dates) => {
              setFilters({
                ...filters,
                startDate: dates?.[0]?.format("YYYY-MM-DD") || null,
                endDate: dates?.[1]?.format("YYYY-MM-DD") || null,
              });
            }}
          />
          <Select
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 140 }}
          >
            <Option value="All">All</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
          </Select>
          <Input placeholder="Search" disabled />
        </div>
        <div className="flex space-x-2">
      <Button
  type="primary"
  icon={<PlusOutlined />}
  className="bg-brown"
  onClick={() => setIsModalOpen(true)}
>
  Add New Orders
</Button>
          <Button icon={<DownloadOutlined />}>Download</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: currentPage,
          total: totalPages * 10, // assuming 10 per page
          onChange: handlePageChange,
          pageSize: 10,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.details}</p>
          ),
        }}
      />
      <CreateOrderModal
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  onSuccess={() => {
    setIsModalOpen(false);
    fetchData();
  }}
/>
    </div>
  );
};

export default OrdersTable;
