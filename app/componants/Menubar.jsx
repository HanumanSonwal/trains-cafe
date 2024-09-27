
import React, { useState } from 'react';
import {
  DashboardOutlined,
  ShopOutlined,
  AppstoreAddOutlined,
  TagOutlined,
  MenuOutlined,
  ImportOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Menubar = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState('1');

  console.log(selectedKey,"selectedKey")

  const handleClick = (e) => {
    setSelectedKey(e.key);
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <ShopOutlined />,
      label: <Link href="/admin/Stations">Stations</Link>,
    },
    {
      key: '3',
      icon: <ShopOutlined />,
      label: <Link href="/admin/vendors">Vendors</Link>,
    },
    {
      key: '4',
      icon: <TagOutlined />,
      label: <Link href="/admin/categories">Categories</Link>,
    },
    {
      key: '5',
      icon: <MenuOutlined />,
      label: <Link href="/admin/menu-item">Menu Items</Link>,
    },
    // {
    //   key: '6',
    //   icon: <ImportOutlined />,
    //   label: <Link href="#">Import</Link>,
    // },
    {
      key: '7',
      icon: <FileTextOutlined />,
      label: <Link href="#">Website Pages</Link>,
    },
    {
      key: '8',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/contact-info">Contact Info</Link>,
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
          label: <Link href="/admin/order">Ongoing</Link>,
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

  const menuStyles = {
    default: { color: "#6F4D27" },
    active: { color: "#D6872A", backgroundColor:"#FAF3CC"  }
  };

  const getItemStyle = (key) => {
    return selectedKey === key ? menuStyles.active : menuStyles.default;
  };

  return (
    <Menu
      style={{ padding: '10px' }}
      theme="light"
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      selectedKeys={[selectedKey]}
      onClick={handleClick}
    >
      {menuItems.map(item => {
        if (item.children) {
          return (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map(child => (
                <Menu.Item key={child.key} style={getItemStyle(child.key)}>
                  {child.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={item.key} icon={item.icon} style={getItemStyle(item.key)}>
            {item.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default Menubar;
