import React from 'react';
import { Layout, Button, Dropdown, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined } from '@ant-design/icons';
import Image from 'next/image';

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
    <Header className="!bg-[#6F4D27]  border-b border-[#f1f1f1] flex items-center justify-between" style={{ position:"sticky", top:0,  zIndex: 1, padding: 0, backgroundColor: "#fff" }}>
      <Button className="!bg-[#FAF3CC] border-2 border-b border-[#6F4D27]" type="dark" onClick={toggleCollapsed} style={{ marginLeft: '16px' }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="flex items-center gap-6" style={{ marginRight: "16px" }}>
        <Dropdown overlay={menu} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/images/avtar.png" alt="Avatar" width={40} height={40} />
            <div className="font-medium text-[#FAF3CC]">Admin</div>
            <DownOutlined className='text-[#FAF3CC]' />
          </div>          
        </Dropdown>
      </div>
    </Header>
  );
}

export default DashHeader;
