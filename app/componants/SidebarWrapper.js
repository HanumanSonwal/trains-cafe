"use client";
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashHeader from './DashHeader';

const SidebarWrapper = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} width={256} />
      <div className="flex flex-col flex-1">
        <DashHeader collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        <main className="p-4 bg-gray-100 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarWrapper;


