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
} from '@ant-design/icons';
import { Menu } from 'antd';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      label: <Link href="/admin/Stations">Stations</Link>,
      path: '/admin/Stations',
    },
    {
      key: '3',
      icon: <ShopOutlined />,
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
      label: <Link href="/admin/menu-item">Menu Items</Link>,
      path: '/admin/menu-item',
    },
    {
      key: '6',
      icon: <PercentageOutlined />,
      label: <Link href="/admin/coupen-managment">Coupon Management</Link>,
      path: '/admin/coupen-managment',
    },
    {
      key: '7',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/websitesPages">Website Pages</Link>,
      path: '/admin/websitesPages',
    },
    {
      key: '17',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/stationPages">Station Pages</Link>,
      path: '/admin/stationPages',
    },
    {
      key: '18',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/TrainPages">Train Pages</Link>,
      path: '/admin/TrainPages',
    },
    {
      key: '8',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/blog">Blog</Link>,
      path: '/admin/blog',
    },
    {
      key: '9',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/contact-info">Contact Info</Link>,
      path: '/admin/contact-info',
    },
    {
      key: '19',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/vendor-request">Vendor Request</Link>,
      path: '/admin/vendor-request',
    },
    {
      key: '10',
      icon: <MessageOutlined />,
      label: <Link href="/admin/contact-inquiry">Contact Inquiry</Link>,
      path: '/admin/contact-inquiry',
    },
    ...(session?.user?.role === 'sab-admin' ? [
      {
        key: '11',
        icon: <UserOutlined />,
        label: <Link href="/admin/manager">Manager</Link>,
        path: '/admin/manager',
      }
    ] : []),
    {
      key: 'sub1',
      icon: <OrderedListOutlined />,
      label: 'Orders',
      children: [
        {
          key: '12',
          label: <Link href="/admin/order">Ongoing</Link>,
          path: '/admin/order',
        },
        {
          key: '13',
          label: <Link href="/admin/order/delivered">Delivered</Link>,
          path: '/admin/order/delivered',
        },
        {
          key: '14',
          label: <Link href="/admin/order/cancelled">Cancelled</Link>,
          path: '/admin/order/cancelled',
        },
      ],
    },
    {
      key: 'sub2',
      icon: <SettingOutlined />,
      label: 'Settings',
      children: [
        {
          key: '15',
          label: <Link href="/admin/settings/profile">Profile</Link>,
          path: '/admin/settings/profile',
        },
        {
          key: '16',
          label: <Link href="/admin/settings/account">Account</Link>,
          path: '/admin/settings/account',
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
