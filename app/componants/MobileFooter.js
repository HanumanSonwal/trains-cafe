import React from 'react';
import { HomeOutlined, ToolOutlined, FileTextOutlined, GiftOutlined, MenuOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import Link from 'next/link'; // Import Link from Next.js

const MobileFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-20 right-0 bg-white shadow-md max-w-[575px] mx-auto">
      <div>
        <Space className="w-full py-3 px-4 flex justify-between items-center">
          <FooterItem icon={<HomeOutlined />} text="Home" link="/" />
          <FooterItem icon={<ToolOutlined />} text="Train Tools" link="/train-tools" />
          <FooterItem icon={<FileTextOutlined />} text="Orders" link="/orders" />
          <FooterItem icon={<GiftOutlined />} text="Offers" link="/offers" />
          <FooterItem icon={<MenuOutlined />} text="Menu" link="/menu" />
        </Space>
      </div>
    </footer>
  );
};

const FooterItem = ({ icon, text, link }) => (
  <Link href={link} className="flex flex-col items-center font-bold hover:text-[#704D25]">
    <span className="text-xl">{icon}</span>
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

export default MobileFooter;
