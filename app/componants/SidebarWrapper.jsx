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
  <Sidebar collapsed={collapsed} width={256} className="fixed top-0 left-0 h-full" />
  
  <div className="flex flex-col flex-1" >
    <DashHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} className="fixed top-0 left-0 right-0" />
    
    <main className="p-8 bg-gray-200 flex-1  overflow-y-auto">
      {children}
    </main>
  </div>
</div>

    </SessionProvider>
  );
};

export default SidebarWrapper;


