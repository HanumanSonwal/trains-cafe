"use client";
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashHeader from './DashHeader';
import { SessionProvider } from 'next-auth/react';

const SidebarWrapper = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SessionProvider>
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} width={256} />
      <div className="flex flex-col flex-1">
        <DashHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        <main className="p-8 bg-gray-200 flex-1">
     
          {children}
       
        </main>
      </div>
    </div>
    </SessionProvider>
  );
};

export default SidebarWrapper;


