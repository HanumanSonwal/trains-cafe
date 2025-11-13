"use client";
import React from "react";
import { Col, Row, Card } from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const GrowthIndicator = ({ percentage }) => {
  const value = Number(percentage || 0);

  if (value > 0) {
    return <span style={{ color: "green", fontWeight: 600 }}>+{value}%</span>;
  }

  if (value < 0) {
    return <span style={{ color: "red", fontWeight: 600 }}>{value}%</span>;
  }

  return <span style={{ color: "#666", fontWeight: 600 }}>0%</span>;
};

const DashboardCard = ({ summaryCards = {}, totals = {} }) => {
  const cardStyle = {
    borderRadius: "14px",
    backgroundColor: "#FFF9E6",
    border: "1.5px solid #D6872A",
    height: "100%",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  };

  const iconWrapper = {
    backgroundColor: "#fff",
    border: "2px solid #D6872A",
    borderRadius: "50%",
    width: 46,
    height: 46,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#D6872A",
    fontSize: "22px",
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={12} lg={6}>
        <Card style={cardStyle} bodyStyle={{ padding: "18px" }} hoverable>
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-700">
                Today’s Orders
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {summaryCards?.todaysOrders?.count || 0}
              </p>
              <p className="text-sm text-gray-600">
                {summaryCards?.todaysOrders?.percentage}% •{" "}
                {summaryCards?.todaysOrders?.compareText}
              </p>
            </div>

            <div style={iconWrapper}>
              <ShoppingCartOutlined />
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <Card style={cardStyle} bodyStyle={{ padding: "18px" }} hoverable>
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-700">
                Today’s Earnings
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {formatCurrency(summaryCards?.todaysEarnings?.amount)}
              </p>
              <p className="text-sm text-gray-600">
                {summaryCards?.todaysEarnings?.percentage}% •{" "}
                {summaryCards?.todaysEarnings?.compareText}
              </p>
            </div>

            <div style={iconWrapper}>
              <DollarCircleOutlined />
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <Card style={cardStyle} bodyStyle={{ padding: "18px" }} hoverable>
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-700">
                Today’s Customers
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {summaryCards?.todaysCustomers?.count || 0}
              </p>
              <p className="text-sm text-gray-600">
                {summaryCards?.todaysCustomers?.percentage}% •{" "}
                {summaryCards?.todaysCustomers?.compareText}
              </p>
            </div>

            <div style={iconWrapper}>
              <TeamOutlined />
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <Card style={cardStyle} bodyStyle={{ padding: "18px" }} hoverable>
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-700">
                {summaryCards?.monthlyAverageEarnings?.title ||
                  "Monthly Avg Earnings"}
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {formatCurrency(summaryCards?.monthlyAverageEarnings?.amount)}
              </p>
              <p className="text-sm text-gray-600">
                {summaryCards?.monthlyAverageEarnings?.percentage}% •{" "}
                {summaryCards?.monthlyAverageEarnings?.compareText}
              </p>
            </div>

            <div style={iconWrapper}>
              <RiseOutlined />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCard;
