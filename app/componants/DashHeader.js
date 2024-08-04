import React from 'react';
import { Layout, Button, Dropdown, Menu, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

function DashHeader({ collapsed, toggleCollapsed }) {
  const menuItems = [
    {
      key: 'profile',
      label: 'Profile Settings',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ];

  const menu = (
    <Menu items={menuItems} />
  );

  return (
    <Header className="!bg-white border-b border-[#f1f1f1] flex items-center justify-between" style={{ padding: 0, backgroundColor: "#fff" }}>
      <Button className="border-b border-[#202020]" type="dark" onClick={toggleCollapsed} style={{ marginLeft: '16px' }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="flex items-center gap-6" style={{ marginRight: "16px" }}>
        <Dropdown menu={menu} placement="bottomRight">
          <Avatar size={45} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

export default DashHeader;
