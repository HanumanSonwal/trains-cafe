import React from 'react';
import { DashboardOutlined, CoffeeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';



const { SubMenu } = Menu;

const Menus = () => {
  return (
    <Menu style={{marginTop:"20px" , padding:"10px"}} theme="light" mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        <Link href="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<CoffeeOutlined />}>
        <Link href="/dashboard/order">Orders</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        <Link href="/customers">Customers</Link>
      </Menu.Item>
      <SubMenu key="sub1" icon={<SettingOutlined />} title="Settings">
        <Menu.Item key="4">
          <Link href="/settings/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link href="/settings/account">Account</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Menus;