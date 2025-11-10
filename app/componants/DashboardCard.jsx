"use client";
import React from "react";
import { Col, Row } from "antd";
import {
  DollarCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import DashboardCardItem from "./DashboardCardItem";

const DashboardCard = ({ summary, totals }) => {
  console.log("DashboardCard summary:", summary);
  console.log("DashboardCard totals:", totals);
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={12} lg={6}>
        <DashboardCardItem
          title="Today's Sales"
          value={`₹${summary.todaySales || 0}`}
          icon={<DollarCircleOutlined />}
          isIncrease={summary.status === "increase"}
        />
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <DashboardCardItem
          title="Total Vendors"
          value={totals.vendors || 0}
          icon={<TeamOutlined />}
          isIncrease={true}
        />
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <DashboardCardItem
          title="Total Menu Items"
          value={totals.menus || 0}
          icon={<CoffeeOutlined />}
          isIncrease={true}
        />
      </Col>

      <Col xs={24} sm={12} md={12} lg={6}>
        <DashboardCardItem
          title="Total Orders"
          value={totals.orders || 0}
          icon={<ShoppingCartOutlined />}
          isIncrease={true}
        />
      </Col>
    </Row>
  );
};

export default DashboardCard;
