'use client';
import React from 'react';
import { Col, Row } from 'antd';
import { DollarOutlined, UserOutlined, HeartOutlined, LockOutlined } from '@ant-design/icons';
import DashboardCardItem from './DashboardCardItem';

const DashboardCard = () => (
  <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="Today's Sales"
        value="$53,000"
        icon={<DollarOutlined />}
        change={30}
        isIncrease={true}
      />
    </Col>
    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="Today's Users"
        value="3,200"
        icon={<UserOutlined />}
        change={20}
        isIncrease={true}
      />
    </Col>
    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="New Clients"
        value="+1,200"
        icon={<HeartOutlined />}
        change={-20}
        isIncrease={false}
      />
    </Col>
    <Col xs={24} sm={12} md={12} lg={6}>
      <DashboardCardItem
        title="New Orders"
        value="$13,200"
        icon={<LockOutlined />}
        change={10}
        isIncrease={true}
      />
    </Col>
  </Row>
);

export default DashboardCard;
