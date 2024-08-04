'use client';
import React from 'react';
import { Card } from 'antd';

const iconStyle = {
  fontSize: '24px',
  color: '#fff',
  backgroundColor: '#1890ff',
  borderRadius: '50%',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px'
};

const DashboardCardItem = ({ title, value, icon, change, isIncrease }) => {
  const changeColor = isIncrease ? 'green' : 'red';

  return (
    <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '16px', color: '#888' }}>{title}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
          <div style={{ color: changeColor }}>{isIncrease ? '+' : ''}{change}%</div>
        </div>
        <div style={iconStyle}>{icon}</div>
      </div>
    </Card>
  );
};

export default DashboardCardItem;
