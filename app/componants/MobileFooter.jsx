"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, ToolOutlined, FileTextOutlined, GiftOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import Link from 'next/link';

const MobileFooter = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Close the menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle clicks outside the menu
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.menu-button')) {
      closeMenu();
    }
  };

  // Add or remove the event listener for clicks outside the menu
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <footer className="fixed bottom-0 left-0 z-50 right-0 bg-white shadow-md max-w-[575px] w-full mx-auto">
        <div>
          <Space className="w-full py-3 px-4 flex justify-between items-center">
            <FooterItem icon={<HomeOutlined />} text="Home" link="/" />
            <FooterItem icon={<ToolOutlined />} text="Train Tools" link="/train-tools" />
            <FooterItem icon={<FileTextOutlined />} text="Orders" link="/orders" />
            <FooterItem icon={<GiftOutlined />} text="Offers" link="/offers" />
            <button onClick={toggleMenu} className="menu-button flex flex-col items-center font-bold text-[#000] hover:text-[#704D25]">
              <span className="text-xl"><MenuOutlined /></span>
              <span className="text-xs mt-1">Menu</span>
            </button>
          </Space>
        </div>
      </footer>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-0 bottom-0 bg-white z-30 shadow-lg overflow-y-auto"
          style={{
            width: '50%',
            maxWidth: '287.5px',
            left: '50%',
            transform: 'translateX(0)',
            height: '100vh',
            maxHeight: '100vh',
          }}
        >
          <div className="p-4 flex justify-end">
            <button onClick={toggleMenu}>
              <CloseOutlined className="text-2xl" />
            </button>
          </div>
          <div className="p-4">
            <nav className="space-y-4">
              <Link href="/profile" className="block text-sm font-bold" onClick={closeMenu}>Profile</Link>
              <Link href="/orders" className="block text-sm font-bold" onClick={closeMenu}>My Orders</Link>
              <Link href="/groupOrder" className="block text-sm font-bold" onClick={closeMenu}>Group Order</Link>
              <Link href="/contactus" className="block text-sm font-bold" onClick={closeMenu}>Contact Us</Link>
              <Link href="/about" className="block text-sm font-bold" onClick={closeMenu}>About Us</Link>
              <Link href="/blog" className="block text-sm font-bold" onClick={closeMenu}>Blog</Link>
              <Link href="/faq" className="block text-sm font-bold" onClick={closeMenu}>FAQ</Link>
              <Link href="/terms" className="block text-sm font-bold" onClick={closeMenu}>Terms & Conditions</Link>
              <Link href="/privacy" className="block text-sm font-bold" onClick={closeMenu}>Privacy Policy</Link>
              <Link href="/cancellation" className="block text-sm font-bold" onClick={closeMenu}>Cancellation Policy</Link>
              <Link href="/feedback" className="block text-sm font-bold" onClick={closeMenu}>Feedback</Link>
              
              <div className="mt-4">
                <p className="text-sm font-bold">Contact Info</p>
                <p className="text-sm">+91-09090909090</p>
                <p className="text-sm">Trainscafe.com</p>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

const FooterItem = ({ icon, text, link }) => (
  <Link href={link} className="flex flex-col items-center font-bold text-[#000] hover:text-[#704D25]">
    <span className="text-xl">{icon}</span>
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

export default MobileFooter;
