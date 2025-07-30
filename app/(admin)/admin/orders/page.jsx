"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  DatePicker,
  Select,
  Input,
  Space,
  Tag,
  message,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import CreateOrderModal from "./CreateOrderModal";

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrdersTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalResetKey, setModalResetKey] = useState(0);

  const [filters, setFilters] = useState({
    status: "All",
    startDate: null,
    endDate: null,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(editingOrder, "editing-Order-in-table");

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
          key: order._id,
          orderID: order._id,
          order_id: order.order_id,

          date: new Date(order.createdAt || order.updatedAt).toLocaleString(),
          Vendor_Name: order?.Vendor_Name || "N/A",
          Items: order?.Items || [],
          subTotal: order?.subTotal || 0,
          tax: order?.payment?.tax || 0,
          couponAmount: order?.couponAmount || 0,
          total: order?.total || 0,
          userDetails: order?.user_details || {},
          station: order?.stationDetails?.Station_Name || "N/A",
          status: order?.status || "Pending",
          paymentStatus: order?.payment?.payment_status || "N/A",
          paymentMethod: order?.payment?.payment_method || "N/A",
        }));

        setDataSource(mappedData);
        setTotalPages(result.totalPages);
      } else {
        message.error("Failed to fetch data");
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

  const handleStatusChange = async (value, record) => {
    try {
      const res = await fetch(`/api/orders/status/${record.orderID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: value }),
      });

      const result = await res.json();
      if (result.success) {
        message.success("Order status updated");
        fetchData(currentPage);
      } else {
        message.error(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      message.error("Error updating order status");
    }
  };

  const handlePaymentStatusChange = async (value, record) => {
    try {
      const res = await fetch(`/api/orders/paymentstatus/${record.orderID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: value }),
      });

      const result = await res.json();
      if (result.success) {
        message.success("Payment status updated");
        fetchData(currentPage);
      } else {
        message.error(result.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Payment status update error:", error);
      message.error("Error updating payment status");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      render: (text, record) => (
        <div>
          <p> <strong>{text}</strong></p>
          <small>{record.date}</small>
        </div>
      ),
    },
    {
      title: "Vendor & Items",
      key: "vendor",
      render: (_, record) => (
        <div>
          <div>
            <strong>{record.Vendor_Name || "N/A"}</strong>
          </div>
          {record.Items?.length > 0 ? (
            <ul className="pl-4 list-disc">
              {record.Items.map((item, idx) => (
                <li key={idx}>
                  {item.Quantity}x {item?.MenuItem?.Item_Name || "Unnamed Item"}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">No Items</div>
          )}
        </div>
      ),
    },
    {
      title: "User Info",
      render: (_, record) => (
        <div>
          <p>
            <strong>Name:</strong> {record.userDetails.name || "N/A"}
          </p>
          <p>
            <strong>Mobile:</strong> {record.userDetails.mobile || "N/A"}
          </p>
          <p>
            <strong>Train:</strong> {record.userDetails.trainNo || "N/A"} |
            Coach: {record.userDetails.coach || "N/A"} | Seat:{" "}
            {record.userDetails.seatNo || "N/A"}
          </p>
          <p>
            <strong>PNR:</strong> {record.userDetails.pnr || "N/A"}
          </p>
        </div>
      ),
    },
   {
  title: "Bill",
  render: (_, record) => (
    <div style={{ lineHeight: "1.5" }}>
      <p>
        <span style={{ marginRight: 8 }}>SubTotal:</span> ₹{record.subTotal}
      </p>
      <p>
        <span style={{ marginRight: 8 }}>Tax:</span> ₹{record.tax}
      </p>
      <p>
        <span style={{ marginRight: 8 }}>Coupon:</span> ₹{record.couponAmount}
      </p>
      <p style={{ fontWeight: "bold", marginTop: 4 }}>
        <span style={{ marginRight: 8 }}>Total:</span> ₹{record.total}
      </p>
    </div>
  ),
}
,
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(value, record)}
        >
          <Option value="placed">Placed</Option>
          <Option value="confirm">Confirm</Option>
          <Option value="cancel">Cancel</Option>
          <Option value="dispatch">Dispatch</Option>
          <Option value="delivered">Delivered</Option>
        </Select>
      ),
    },
    {
      title: "Payment",
      render: (_, record) => (
        <Space>
          <Select
            value={record.paymentStatus}
            style={{ width: 120 }}
            onChange={(value) => handlePaymentStatusChange(value, record)}
          >
            <Option value="pending">Pending</Option>
            <Option value="paid">Paid</Option>
            <Option value="failed">Failed</Option>
          </Select>
          <Tag color="purple">{record.paymentMethod}</Tag>
        </Space>
      ),
    },
   {
  title: "Action",
  render: (_, record) => (
    <Space>
      <Button
        icon={<EditOutlined />}
        onClick={() => {
          setEditingOrder(record);
          setIsModalOpen(true);
        }}
      />

     <Tooltip title="Download Invoice">
  <Button
    icon={<DownloadOutlined />}
    onClick={() =>
      window.open(`/api/orders/invoice/${record.orderID}`, "_blank")
    }
  />
</Tooltip>

    </Space>
  ),
}
,
  ];

  return (
    <div>
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
            <Option value="placed">Placed</Option>
            <Option value="confirm">Confirm</Option>
            <Option value="cancel">Cancel</Option>
            <Option value="dispatch">Dispatch</Option>
            <Option value="delivered">Delivered</Option>
          </Select>
          {/* <Input placeholder="Search" disabled /> */}
        </div>
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
            onClick={() => {
              setEditingOrder(null);
              setIsModalOpen(true);
            }}
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
          total: totalPages * 10,
          onChange: handlePageChange,
          pageSize: 10,
        }}
      />

      <CreateOrderModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
          setModalResetKey((prev) => prev + 1);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
          fetchData();
          setModalResetKey((prev) => prev + 1);
        }}
        initialData={editingOrder}
      />
    </div>
  );
};

export default OrdersTable;
