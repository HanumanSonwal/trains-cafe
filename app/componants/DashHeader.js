import React from 'react';
import { Layout, Button, Dropdown, Menu, Avatar, Badge } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';

const { Header } = Layout;

function DashHeader({ collapsed, toggleCollapsed }) {
  const menu = (
    <Menu>
      <Menu.Item key="profile">
        Profile Settings
      </Menu.Item>
      <Menu.Item key="logout">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="!bg-white border-b border-[#f1f1f1] flex items-center justify-between" style={{ padding: 0, backgroundColor: "#fff" }}>
      <Button className="border-b border-[#202020]" type="dark" onClick={toggleCollapsed} style={{ marginLeft: '16px' }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="flex items-center gap-6" style={{ marginRight: "16px" }}>
        {/* <Badge count={5}>
          <BellOutlined style={{ fontSize: '24px' }} />
        </Badge> */}
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar size={45} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

export default DashHeader;