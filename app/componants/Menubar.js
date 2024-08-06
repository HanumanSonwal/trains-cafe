import React from 'react';
import { DashboardOutlined, ShopOutlined, AppstoreAddOutlined, TagOutlined, MenuOutlined, ImportOutlined, FileTextOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
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
      icon: <ShopOutlined />,
      label: <Link href="#">Stations</Link>,
    },
    {
      key: '3',
      icon: <ShopOutlined />,
      label: <Link href="#">Vendors</Link>,
    },
    {
      key: '4',
      icon: <TagOutlined />,
      label: <Link href="#">Categories</Link>,
    },
    {
      key: '5',
      icon: <MenuOutlined />,
      label: <Link href="#">Menu Items</Link>,
    },
    {
      key: '6',
      icon: <ImportOutlined />,
      label: <Link href="#">Import</Link>,
    },
    {
      key: '7',
      icon: <FileTextOutlined />,
      label: <Link href="#">Website Pages</Link>,
    },
    {
      key: '8',
      icon: <FileTextOutlined />,
      label: <Link href="#">Contact Info</Link>,
    },
    {
      key: '9',
      icon: <UserOutlined />,
      label: <Link href="#">Customers</Link>,
    },
    {
      key: 'sub1',
      icon: <SettingOutlined />,
      label: 'Orders',
      children: [
        {
          key: '10',
          label: <Link href="#">Ongoing</Link>,
        },
        {
          key: '11',
          label: <Link href="#">Delivered</Link>,
        },
        {
          key: '12',
          label: <Link href="#">Cancelled</Link>,
        },
      ],
    },
    {
      key: 'sub2',
      icon: <SettingOutlined />,
      label: 'Settings',
      children: [
        {
          key: '13',
          label: <Link href="#">Profile</Link>,
        },
        {
          key: '14',
          label: <Link href="#">Account</Link>,
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

