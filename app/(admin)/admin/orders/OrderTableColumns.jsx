import React from "react";
import { Select, Tag, Space, Button, Tooltip } from "antd";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import ItemsColumn from "./ItemsColumn";

const { Option } = Select;

const OrderTableColumns = ({
  handleStatusChange,
  handlePaymentStatusChange,
  setEditingOrder,
  setIsModalOpen,
  fetchData,
  currentPage,
}) => {
  return [
    {
      title: "Order ID",
      dataIndex: "order_id",
      width: 110,
      render: (text, record) => (
        <div style={{ whiteSpace: "pre-line", fontSize: 12 }}>
          <strong>{text}</strong>
          <br />
          <small>{record.date}</small>
        </div>
      ),
    },
    {
      title: "User Info",
      dataIndex: "userDetails",
      width: 200,
      render: (userDetails) => (
        <div style={{ fontSize: 12, maxWidth: 200, lineHeight: "1.4" }}>
          <p style={{ margin: "1px 0", wordBreak: "break-word" }}>
            <strong>Name:</strong> {userDetails?.name || "N/A"}
          </p>
          <p style={{ margin: "1px 0", wordBreak: "break-word" }}>
            <strong>Mobile:</strong> {userDetails?.mobile || "N/A"}
          </p>
          <p style={{ margin: "1px 0", wordBreak: "break-word" }}>
            <strong>Email:</strong> {userDetails?.email || "N/A"}
          </p>
          <p style={{ margin: "1px 0" }}>
            <strong>Coach:</strong> {userDetails?.coach || "N/A"}
          </p>
          <p style={{ margin: "1px 0" }}>
            <strong>Seat:</strong> {userDetails?.seatNo || "N/A"}
          </p>
          <p style={{ margin: "1px 0" }}>
            <strong>PNR:</strong> {userDetails?.pnr || "N/A"}
          </p>
        </div>
      ),
    },
    {
      title: "Vendor",
      key: "vendor",
      width: 150,
      render: (_, record) => {
        const v = record.Vendor_Details || {};
        return (
          <div style={{ fontSize: 12, maxWidth: 150, lineHeight: "1.4" }}>
            <p style={{ margin: "1px 0", fontWeight: "bold", wordBreak: "break-word" }}>
              {record.Vendor_Name || v.Vendor_Name || "N/A"}
            </p>
            <p style={{ margin: "1px 0" }}>
              <strong>Contact:</strong><br />
              {v.Contact_No || "N/A"}
              {v.Alternate_Contact_No && (
                <>
                  <br />
                  <small>{v.Alternate_Contact_No}</small>
                </>
              )}
            </p>
          </div>
        );
      },
    },
    {
      title: "Items",
      key: "items",
      width: 220,
      render: (_, record) => {
        const maxItemsToShow = 3;
        if (record.Items.length <= maxItemsToShow) {
          return (
            <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: 12 }}>
              <ul
                style={{
                  paddingLeft: 14,
                  listStyleType: "disc",
                  margin: 0,
                  maxWidth: 220,
                }}
              >
                {record.Items.map((item, idx) => {
                  const menu = item.MenuItem || {};
                  return (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <div style={{ wordBreak: "break-word" }}>
                        <strong>
                          {item.Quantity}x {menu.Item_Name || "Unnamed Item"}
                        </strong>
                      </div>
                      <div>
                        <small style={{ color: "#52c41a" }}>
                          ₹{menu.Price || item.Price || 0}
                        </small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        } else {
          return <ItemsColumn items={record.Items} />;
        }
      },
    },
    {
      title: "Bill Details",
      width: 250,
      render: (_, record) => {
        const {
          subTotal = 0,
          tax = 0,
          couponAmount = 0,
          adminDiscountValue = 0,
          remainingAmount = 0,
          advancedAmount = 0,
          total = 0,
          payment = {},
        } = record;

        const paymentStatus = payment.payment_status || "pending";

        return (
          <div style={{ 
            lineHeight: "1.4", 
            fontSize: 12, 
            maxWidth: 250,
            maxHeight: "200px",
            overflowY: "auto",
            padding: "4px"
          }}>
            <p style={{ margin: "2px 0", display: "flex", justifyContent: "space-between" }}>
              <strong>SubTotal:</strong> 
              <span style={{ color: "#1890ff" }}>₹{subTotal.toFixed(2)}</span>
            </p>
            
            <p style={{ margin: "2px 0", display: "flex", justifyContent: "space-between" }}>
              <strong>Tax:</strong> 
              <span style={{ color: "#722ed1" }}>₹{tax.toFixed(2)}</span>
            </p>
            
            {couponAmount > 0 && (
              <p style={{ margin: "2px 0", display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#ff4d4f" }}>Coupon Discount:</strong> 
                <span style={{ color: "#ff4d4f" }}>-₹{couponAmount.toFixed(2)}</span>
              </p>
            )}
            
            {adminDiscountValue > 0 && (
              <p style={{ margin: "2px 0", display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#f5222d" }}>Admin Discount:</strong> 
                <span style={{ color: "#f5222d" }}>-₹{adminDiscountValue.toFixed(2)}</span>
              </p>
            )}
            
            {advancedAmount > 0 && (
              <p style={{ margin: "2px 0", display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#52c41a" }}>Advanced Paid:</strong> 
                <span style={{ color: "#52c41a" }}>₹{advancedAmount.toFixed(2)}</span>
              </p>
            )}
            
            {advancedAmount > 0 && (
              <p style={{ margin: "2px 0", display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#fa8c16" }}>Remaining:</strong> 
                <span style={{ color: "#fa8c16" }}>₹{remainingAmount.toFixed(2)}</span>
              </p>
            )}
            
            <div style={{ 
              borderTop: "2px solid #d9d9d9", 
              paddingTop: "4px", 
              marginTop: "6px" 
            }}>
              <p style={{ 
                fontWeight: "bold", 
                margin: "2px 0", 
                fontSize: "14px",
                display: "flex", 
                justifyContent: "space-between",
                backgroundColor: "#f0f0f0",
                padding: "2px 4px",
                borderRadius: "4px"
              }}>
                <span>Total:</span>
                <span style={{ color: "#1890ff" }}>₹{total.toFixed(2)}</span>
              </p>
              
              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <Tag
                  color={
                    paymentStatus === "paid"
                      ? "green"
                      : paymentStatus === "pending"
                      ? "orange"
                      : "red"
                  }
                  style={{ fontSize: "11px", fontWeight: "bold" }}
                >
                  {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                </Tag>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: "100%" }}
          size="small"
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
      title: "Payment Status",
      width: 120,
      render: (_, record) => (
        <Select
          value={record.paymentStatus}
          style={{ width: "100%" }}
          size="small"
          onChange={(value) => handlePaymentStatusChange(value, record)}
        >
          <Option value="pending">Pending</Option>
          <Option value="paid">Paid</Option>
          <Option value="failed">Failed</Option>
        </Select>
      ),
    },
    {
      title: "Payment Method",
      width: 130,
      render: (_, record) => {
        const paymentMethod = record.paymentMethod?.toLowerCase() || '';
        
        // Color mapping for payment methods
        const getPaymentMethodColor = (method) => {
          switch (method) {
            case 'razorpay':
              return '#1890ff'; 
            case 'cod':
            case 'cash on delivery':
              return '#52c41a'; 
            case 'paytm':
              return '#722ed1'; 
            case 'phonepe':
              return '#fa541c'; 
            case 'gpay':
            case 'google pay':
              return '#13c2c2'; 
            case 'upi':
              return '#ff7a45'; 
            case 'card':
            case 'credit card':
            case 'debit card':
              return '#2f54eb'; 
            case 'netbanking':
              return '#eb2f96'; 
            default:
              return '#8c8c8c'; 
          }
        };

        return (
          <div style={{ textAlign: "center" }}>
            <Tag 
              style={{ 
                backgroundColor: getPaymentMethodColor(paymentMethod),
                color: 'white',
                border: 'none',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            >
              {record.paymentMethod || 'N/A'}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Order">
            <Button
              icon={<EditOutlined className="text-white" />}
              size="small"
              onClick={() => {
                setEditingOrder(record);
                setIsModalOpen(true);
              }}
              style={{ 
                backgroundColor: "#D6872A", 
                borderColor: "#D6872A",
                color: "white"
              }}
            />
          </Tooltip>
          <Tooltip title="Download Invoice">
            <Button
              icon={<DownloadOutlined className="text-white" />}
              size="small"
              onClick={() =>
                window.open(`/api/orders/invoice/${record.orderID}`, "_blank")
              }
              style={{ 
                backgroundColor: "#52c41a", 
                borderColor: "#52c41a",
                color: "white"
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
};

export default OrderTableColumns;