"use client";
import { Layout, Menu } from 'antd';
import { HomeOutlined, ToolOutlined, ShoppingCartOutlined, TagsOutlined, MenuOutlined } from '@ant-design/icons';

const { Footer } = Layout;

export default function CustomFooter() {
  return (
    <Footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
      <Menu mode="horizontal" style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="train-tools" icon={<ToolOutlined />}>
          Train Tools
        </Menu.Item>
        <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
          Orders
        </Menu.Item>
        <Menu.Item key="offers" icon={<TagsOutlined />}>
          Offers
        </Menu.Item>
        <Menu.Item key="menu" icon={<MenuOutlined />}>
          Menu
        </Menu.Item>
      </Menu>
    </Footer>
  );
}
