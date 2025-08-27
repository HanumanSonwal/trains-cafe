/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  ShopOutlined,
  TagOutlined,
  MenuOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  OrderedListOutlined,
  MessageOutlined,
  PercentageOutlined,
  GlobalOutlined,
  InboxOutlined,
  BookOutlined,
  SolutionOutlined,
  ProfileOutlined,
  HomeOutlined,
  DatabaseOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { color } from 'framer-motion';

const Menubar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState('');

  useEffect(() => {
    const matchedItem = menuItems.find(item => pathname.includes(item.path));
    if (matchedItem) {
      setSelectedKey(matchedItem.key);
    }
  }, [pathname]);

  const handleClick = (e) => {
    setSelectedKey(e.key);
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
      path: '/admin/dashboard',
    },
    {
      key: '2',
      icon: <ShopOutlined />,
      label: <Link href="/admin/stations-managment">Stations</Link>,
      path: '/admin/stations-managment',
    },
    {
      key: '3',
      icon: <DatabaseOutlined />,
      label: <Link href="/admin/vendors">Vendors</Link>,
      path: '/admin/vendors',
    },
    {
      key: '4',
      icon: <TagOutlined />,
      label: <Link href="/admin/categories">Categories</Link>,
      path: '/admin/categories',
    },
    {
      key: '5',
      icon: <MenuOutlined />,
      label: <Link href="/admin/menu-items">Menu Items</Link>,
      path: '/admin/menu-items',
    },
    {
      key: '6',
      icon: <PercentageOutlined />,
      label: <Link href="/admin/coupon-management">Coupon Management</Link>,
      path: '/admin/coupon-management',
    },

    {
      key: '11',
      icon: <SolutionOutlined />,
      label: <Link href="/admin/contact-info">Contact Info</Link>,
      path: '/admin/contact-info',
    },
    {
      key: '12',
      icon: <ProfileOutlined />,
      label: <Link href="/admin/vendor-requests">Vendor Requests</Link>,
      path: '/admin/vendor-requests',
    },
    {
      key: '13',
      icon: <MessageOutlined />,
      label: <Link href="/admin/contact-inquiries">Contact Inquiries</Link>,
      path: '/admin/contact-inquiries',
    },
        {
      key: '20',
      icon: <OrderedListOutlined />,
      label: <Link href="/admin/orders">Orders Managment</Link>,
      path: '/admin/orders',
    },
    ...(session?.user?.role === 'sab-admin'
      ? [
          {
            key: '14',
            icon: <UserOutlined />,
            label: <Link href="/admin/managers">Managers</Link>,
            path: '/admin/managers',
          },
        ]
      : []),
      {
        key: 'sub-pages',
        icon: <GlobalOutlined />,
        label: 'Page Settings',
        children: [
          {
            key: 'ps-1',
            label: <Link href="/admin/website-pages">Website Pages</Link>,
            path: '/admin/website-pages',
          },
          {
            key: 'ps-2',
            label: <Link href="/admin/station-pages">Station Pages</Link>,
            path: '/admin/station-pages',
          },
          // {
          //   key: 'ps-3',
          //   label: <Link href="/admin/train-pages">Train Pages</Link>,
          //   path: '/admin/train-pages',
          // },
          {
            key: 'ps-4',
            label: <Link href="/admin/blog">Blog </Link>,
            path: '/admin/blog',
          },
          // {
          //   key: 'ps-5',
          //   label: <Link href="/admin/advertisements">Advertisements </Link>,
          //   path: '/admin/advertisements',
          // },
            {
            key: 'ps-6',
            label: <Link href="/admin/uploadimages">Images Managment </Link>,
            path: '/admin/uploadimages',
          },
        ],
      },
  ];

  const menuStyles = {
    default: { color: '#6F4D27' },
    active: { color: '#D6872A', backgroundColor: '#FAF3CC' },
  };

  const getItemStyle = (path) => {
    return pathname.includes(path) ? menuStyles.active : menuStyles.default;
  };

  return (
    <Menu
      style={{ padding: '10px' }}
      theme="light"
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={handleClick}
    >
      {menuItems.map(item => {
        if (item.children) {
          return (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map(child => (
                <Menu.Item key={child.key} style={getItemStyle(child.path)}>
                  {child.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={item.key} icon={item.icon} style={getItemStyle(item.path)}>
            {item.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default Menubar;
