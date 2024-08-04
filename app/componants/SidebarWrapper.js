"use client";
import { Layout } from "antd"; // Importing Layout from antd
import Sidebar from "./Sidebar";
import DashHeader from "./DashHeader";
import { useState } from "react";

const { Content } = Layout; // Destructure Content from Layout

const SidebarWrapper = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} width={256} />
      <Layout className="site-layout">
        <DashHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarWrapper;

