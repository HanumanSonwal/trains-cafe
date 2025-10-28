import React, { useState } from "react";
import {
  Select,
  Table,
  Tag,
  Space,
  Modal,
  Button,
  Tooltip,
  Typography,
  Badge,
} from "antd";

import {
  DownloadOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import ItemsColumn from "./ItemsColumn";
import dayjs from "dayjs";

const { Option } = Select;
const { Text } = Typography;

const OrderTableColumns = ({
  handleStatusChange,
  handlePaymentStatusChange,
  setEditingOrder,
  setIsModalOpen,
  fetchData,
  currentPage,
}) => {
  const getPaymentMethodColor = (method) => {
    const lowerMethod = method?.toLowerCase() || "";
    const colorMap = {
      razorpay: "blue",
      cod: "green",
      "cash on delivery": "green",
    };
    return colorMap[lowerMethod] || "default";
  };

  return [
    {
      title: "Order ID",
      key: "orderDetails",
      width: 150,
      render: (_, record) => (
        <div style={{ lineHeight: 1.3 }}>
          <Text strong style={{ fontSize: "15px", color: "#2c3e50" }}>
            #{record.order_id}
          </Text>
          <br />
          <Text style={{ fontSize: "12px", color: "#7f8c8d" }}>
            {record.date}
          </Text>
          <br />
          <Tag
            color={
              record.status === "delivered"
                ? "#27ae60"
                : record.status === "dispatch"
                ? "#f39c12"
                : record.status === "confirm"
                ? "#3498db"
                : record.status === "cancel"
                ? "#e74c3c"
                : "#9b59b6"
            }
            style={{ fontSize: "12px", padding: "1px 6px", marginTop: "2px" }}
          >
            {record.status?.toUpperCase()}
          </Tag>
          &nbsp;
          <Tag
            color={record.orderSource === "admin" ? "#2980b9" : "#16a085"}
            style={{ fontSize: "12px", padding: "1px 6px", marginTop: "2px" }}
          >
            {record.orderSource?.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customerInfo",
      width: 250,
      render: (_, record) => {
        const user = record.userDetails || {};
        const trainDetails = record.trainDetails || {};

        return (
          <div style={{ fontSize: "13px", lineHeight: 1.4, maxWidth: 250 }}>
            <div
              style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: 2 }}
            >
              {user.name || "N/A"}
            </div>

            <div style={{ color: "#7f8c8d", marginBottom: 2 }}>
              <PhoneOutlined style={{ marginRight: 4 }} />{" "}
              {user.mobile || "N/A"}
            </div>
            {user.email && (
              <div style={{ color: "#7f8c8d", marginBottom: 2 }}>
                <MailOutlined style={{ marginRight: 4 }} /> {user.email}
              </div>
            )}

            {(user.coach || user.seatNo) && (
              <div style={{ color: "#95a5a6", marginBottom: 2 }}>
                {user.coach && `Coach: ${user.coach}`}{" "}
                {user.seatNo && `• Seat: ${user.seatNo}`}
              </div>
            )}

            <div
              style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: 2 }}
            >
              Delivery Info:
            </div>
            <div style={{ color: "#95a5a6", marginBottom: 2 }}>
              {record.station && `Station: ${record.station}`}{" "}
              {trainDetails.train_number &&
                `• Train No: ${trainDetails.train_number}`}{" "}
              {trainDetails.train_pnr && `• PNR: ${trainDetails.train_pnr}`}
            </div>

            {record.deliveryDateTime && (
              <div style={{ color: "#7f8c8d" }}>
                <strong>Delivery:</strong>{" "}
                {dayjs(record.deliveryDateTime).format("DD MMM YYYY, hh:mm A")}
              </div>
            )}
          </div>
        );
      },
    },

    {
      title: "Vendor",
      key: "vendor",
      width: 140,
      render: (_, record) => {
        const vendor = record.Vendor_Details || {};
        const vendorName = record.Vendor_Name || vendor.Vendor_Name || "N/A";

        return (
          <div style={{ fontSize: "15px", lineHeight: 1.3 }}>
            <div
              style={{
                fontWeight: "bold",
                color: "#8e44ad",
                marginBottom: "2px",
              }}
            >
              {vendorName}
            </div>
            {vendor.Contact_No && (
              <div style={{ color: "#27ae60", fontSize: "13px" }}>
                <PhoneOutlined style={{ marginRight: 4 }} /> {vendor.Contact_No}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Items",
      key: "items",
      width: 200,
      render: (_, record) => {
        const items = record.Items || [];
        const maxItemsToShow = 3;

        if (items.length <= maxItemsToShow) {
          return (
            <div
              style={{
                fontSize: "13px",
                maxHeight: "80px",
                overflow: "hidden",
              }}
            >
              {items.slice(0, maxItemsToShow).map((item, idx) => {
                const menu = item.MenuItem || {};
                const itemName = menu.Item_Name || "Unnamed Item";
                const price = menu.Price || item.Price || 0;

                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "3px",
                      padding: "3px 6px",
                      backgroundColor: "#ecf0f1",
                      borderRadius: "3px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#2c3e50", fontWeight: "500" }}>
                      {item.Quantity}x{" "}
                      {itemName.length > 15
                        ? itemName.substring(0, 15) + "..."
                        : itemName}
                    </span>
                    <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                      ₹{price}
                    </span>
                  </div>
                );
              })}
              {items.length > maxItemsToShow && (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#7f8c8d",
                    textAlign: "center",
                  }}
                >
                  +{items.length - maxItemsToShow} more items
                </div>
              )}
            </div>
          );
        } else {
          return <ItemsColumn items={items} />;
        }
      },
    },
    {
      title: "Bill Summary",
      key: "billDetails",
      width: 200,
      render: (_, record) => {
        const {
          subTotal = 0,
          couponAmount = 0,
          adminDiscountValue = 0,
          remainingAmount = 0,
          advancedAmount = 0,
          payment = {},
        } = record;

        const paymentStatus =
          payment.payment_status || record.paymentStatus || "pending";

        const discountedAmount = subTotal - couponAmount - adminDiscountValue;
        const tax = discountedAmount * 0.05;
        const total = discountedAmount + tax;

        return (
          <div style={{ fontSize: "13px", lineHeight: 1.3 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2px",
              }}
            >
              <span style={{ color: "#34495e" }}>Subtotal:</span>
              <span style={{ color: "#3498db", fontWeight: "bold" }}>
                ₹{subTotal.toFixed(2)}
              </span>
            </div>

            {couponAmount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#e74c3c" }}>Coupon Discount:</span>
                <span style={{ color: "#e74c3c" }}>
                  -₹{couponAmount.toFixed(2)}
                </span>
              </div>
            )}

            {adminDiscountValue > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#e74c3c" }}>Admin Discount:</span>
                <span style={{ color: "#e74c3c" }}>
                  -₹{adminDiscountValue.toFixed(2)}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2px",
              }}
            >
              <span style={{ color: "#34495e" }}>Tax (5%):</span>
              <span style={{ color: "#9b59b6" }}>₹{tax.toFixed(2)}</span>
            </div>

            {advancedAmount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#16a085" }}>Advance Paid:</span>
                <span style={{ color: "#16a085" }}>
                  ₹{advancedAmount.toFixed(2)}
                </span>
              </div>
            )}

            {advancedAmount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span style={{ color: "#c0392b" }}>Remaining:</span>
                <span style={{ color: "#c0392b" }}>
                  ₹{remainingAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 6px",
                backgroundColor: "#34495e",
                color: "white",
                borderRadius: "3px",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div style={{ textAlign: "center", marginTop: "4px" }}>
              <Tag
                color={
                  paymentStatus === "paid"
                    ? "#27ae60"
                    : paymentStatus === "pending"
                    ? "#f39c12"
                    : "#e74c3c"
                }
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  border: "none",
                }}
              >
                {paymentStatus.toUpperCase()}
              </Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 130,
      render: (status, record) => {
        const statusColors = {
          delivered: "#27ae60",
          dispatch: "#f39c12",
          confirm: "#3498db",
          cancel: "#e74c3c",
          placed: "#9b59b6",
        };

        return (
          <Select
            value={status}
            style={{ width: "100%" }}
            size="small"
            onChange={(value) => handleStatusChange(value, record)}
            dropdownRender={(menu) => menu}
          >
            {Object.keys(statusColors).map((key) => (
              <Select.Option key={key} value={key}>
                <span style={{ color: statusColors[key], fontWeight: "bold" }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Payment Status",
      width: 150,
      render: (_, record) => {
        const paymentColors = {
          pending: "#f39c12",
          paid: "#27ae60",
          failed: "#e74c3c",
        };

        const paymentValue = record.paymentStatus?.toLowerCase() || "pending";

        return (
          <Select
            value={paymentValue}
            style={{ width: "100%" }}
            size="small"
            onChange={(value) => handlePaymentStatusChange(value, record)}
          >
            {Object.keys(paymentColors).map((key) => (
              <Select.Option key={key} value={key}>
                <span style={{ color: paymentColors[key], fontWeight: "bold" }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: <Text strong>Payment Method</Text>,
      key: "paymentMethod",
      width: 140,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <Tag
            color={getPaymentMethodColor(record.paymentMethod)}
            style={{
              fontSize: "12px",
              fontWeight: "600",
              padding: "6px 12px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {record.paymentMethod || "N/A"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {/* 🟠 Edit Order */}
          <Tooltip title="Edit Order">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingOrder(record);
                setIsModalOpen(true);
              }}
              style={{
                backgroundColor: "#D6872A",
                borderColor: "#D6872A",
                width: 32,
                height: 28,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </Tooltip>

          <Tooltip title="Download Invoice">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              onClick={() =>
                window.open(`/api/orders/invoice/${record.orderID}`, "_blank")
              }
              style={{
                backgroundColor: "#6F4D27",
                borderColor: "#6F4D27",
                width: 32,
                height: 28,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </Tooltip>

          {/* 📋 Copy Order Details */}
          <Tooltip title="Copy Order Details">
            <Button
              type="primary"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => {
                const orderText = `
------------------------------------------------------------
                     ORDER SUMMARY
------------------------------------------------------------

 Order ID         : ${record.order_id}
 Customer Name    : ${record.userDetails?.name || "N/A"}
 Mobile Number    : ${record.userDetails?.mobile || "N/A"}
 Station          : ${record.station || "N/A"}
 Train Number     : ${record.trainDetails?.train_number || "N/A"}
 Total Amount     : ₹${record.total}
 Payment Method   : ${record.paymentMethod || "N/A"}
 Order Date       : ${record.date}
 Current Status   : ${record.status}

------------------------------------------------------------
Thank you for choosing *TrainsCafe*!  
We appreciate your business.
------------------------------------------------------------
`;
                navigator.clipboard.writeText(orderText);
              }}
              style={{
                backgroundColor: "#4A90E2",
                borderColor: "#4A90E2",
                color: "#fff",
                width: 32,
                height: 28,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
};

export default OrderTableColumns;
