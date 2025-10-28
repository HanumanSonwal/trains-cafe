'use client';
import React from 'react';
import { Col, Row } from 'antd';
import {
  DollarCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import DashboardCardItem from './DashboardCardItem';

const DashboardCard = () => (
  <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="Today's Sales"
        value="₹53,000"
        icon={<DollarCircleOutlined />}
        isIncrease={true}
      />
    </Col>

    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="Total Vendors"
        value="3"
        icon={<TeamOutlined />}
        isIncrease={true}
      />
    </Col>

    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="Total Menu Items"
        value="6"
        icon={<CoffeeOutlined />}
        isIncrease={true}
      />
    </Col>

    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="Total Orders"
        value="₹13,200"
        icon={<ShoppingCartOutlined />}
        isIncrease={true}
      />
    </Col>
  </Row>
);

export default DashboardCard;
