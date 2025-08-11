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
  Dropdown,
  Menu,
  Tooltip,
  Spin,
} from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CreateOrderModal from "./CreateOrderModal";
import ItemsColumn from "./ItemsColumn";
import OrderTableColumns from "./OrderTableColumns";

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

  const buildQueryParams = (filters, extra = {}) => {
    const { status, startDate, endDate } = filters;
    let query = [];

    if (status && status !== "All") {
      query.push(`status=${encodeURIComponent(status)}`);
    }
    if (startDate) {
      query.push(`startDate=${encodeURIComponent(startDate)}`);
    }
    if (endDate) {
      query.push(`endDate=${encodeURIComponent(endDate)}`);
    }

    for (const key in extra) {
      if (extra[key] !== undefined && extra[key] !== "") {
        query.push(`${key}=${encodeURIComponent(extra[key])}`);
      }
    }

    return query.length > 0 ? `?${query.join("&")}` : "";
  };
  const handleExport = (format) => {
    const query = buildQueryParams(filters, { format });
    const url = `/api/orders/export${query}`;
    window.open(url, "_blank");
  };

const fetchData = async (page = 1, limit = 10) => {
  setLoading(true);
  try {
    const query = buildQueryParams(filters, { page, limit });
    const response = await fetch(`/api/orders${query}`);
    const result = await response.json();

    if (result.success) {
      const mappedData = result.docs.map((order) => ({
        key: order._id,
        orderID: order._id,
        order_id: order.order_id,
        date: new Date(order.createdAt || order.updatedAt).toLocaleString(),
        Vendor_Name: order?.Vendor_Name || "N/A",
        Vendor_Details: order?.Vendor_Details || {},  
        Items: order?.Items || [],
        subTotal: order?.subTotal || 0,
        tax: order?.payment?.tax || 0,
        couponAmount: order?.couponAmount || 0,                
        adminDiscountValue: order?.adminDiscountValue || 0,    
        advancedAmount: order?.payment?.advanced || 0,
        remainingAmount: order?.remainingAmount || 0,
        total: order?.total || 0,
        userDetails: order?.user_details || {},
          trainDetails: order?.train || {},   
        station: order?.station?.name || "N/A",
        status: order?.status || "Pending",
        payment: order.payment || {}, 
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
    message.error("Error fetching data");
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

  const columns = OrderTableColumns({
    handleStatusChange,
    handlePaymentStatusChange,
    setEditingOrder,
    setIsModalOpen,
    fetchData,
    currentPage,
  });

 const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  return (
     <div
      className="p-4"
      style={{
        backgroundColor: "#FAF3CC",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
        Orders Management
      </h2>
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
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => {
                  handleExport(key);
                }}
              >
                <Menu.Item key="pdf">Export as PDF</Menu.Item>
                <Menu.Item key="xlsx">Export as Excel</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<DownloadOutlined />}>
              Download <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
 <Spin spinning={loading} indicator={antIcon}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: currentPage,
          total: totalPages * 10,
          onChange: handlePageChange,
          pageSize: 10,
        }}
      />
      </Spin>

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
