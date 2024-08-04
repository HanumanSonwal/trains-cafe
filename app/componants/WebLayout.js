import { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import '@/app/globals.css';
import Header from './Header';
import CustomFooter from './Footer';

const { Content, Footer } = Layout;

const WebLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Header/>
      <Layout className="site-layout">
        
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
        <CustomFooter/>
     
      </Layout>
    </Layout>
  );
};

export default WebLayout;