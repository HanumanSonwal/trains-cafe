"use client";
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { usePathname } from 'next/navigation';
import WebLayout from './WebLayout';
import DashboardLayout from './DashboardLayout';



function MainLayoutComponant({ children }) {
  const pathname = usePathname();

  return (
    <AntdRegistry>
      {pathname === '/' ? (
        <WebLayout>
          {children}
        </WebLayout>
      ) : (
        <DashboardLayout>
          {children}
        </DashboardLayout>
      )}
    </AntdRegistry>
  );
}

export default MainLayoutComponant;
