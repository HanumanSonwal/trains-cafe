import { useState } from 'react';
import { Layout } from 'antd';
import '@/app/globals.css';
import Sidebar from './Sidebar';
import DashHeader from './DashHeader';

const { Content, Footer } = Layout;

const DashboardLayout = ({ children }) => {
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
        <Footer style={{ textAlign: 'center' }}>Cafe Management Dashboard ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;