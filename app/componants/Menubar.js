import React from 'react';
import { DashboardOutlined, CoffeeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';

const Menubar = () => {
  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <CoffeeOutlined />,
      label: <Link href="/dashboard/order">Orders</Link>,
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: <Link href="/customers">Customers</Link>,
    },
    {
      key: 'sub1',
      icon: <SettingOutlined />,
      label: 'Settings',
      children: [
        {
          key: '4',
          label: <Link href="/settings/profile">Profile</Link>,
        },
        {
          key: '5',
          label: <Link href="/settings/account">Account</Link>,
        },
      ],
    },
  ];

  return (
    <Menu
      style={{ marginTop: '20px', padding: '10px' }}
      theme="light"
      mode="inline"
      defaultSelectedKeys={['1']}
      items={menuItems}
    />
  );
};

export default Menubar;
