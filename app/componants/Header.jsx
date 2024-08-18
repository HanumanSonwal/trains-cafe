"use client"

import { useState } from 'react';
import { PhoneOutlined, WhatsAppOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
      <div>
        {/* Top Header */}
        <div className="bg-gray-100 flex justify-center gap-4 p-2 text-center text-sm">
          <Link href='tel:090909090' className="transition-transform transform hover:scale-105 hover:shadow-md flex items-center justify-center bg-white border border-gray-300 rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50">
            <PhoneOutlined className="mr-2" />
            <span className="font-small text-xs">Order via Call</span>
          </Link>
          <Link href='https://wa.me/090909090' className="transition-transform transform hover:scale-105 hover:shadow-md flex items-center justify-center bg-white border border-gray-300 rounded-lg px-2 py-1 text-green-600 hover:bg-green-50">
            <WhatsAppOutlined className="mr-2" />
            <span className="font-medium text-xs">Order via WhatsApp</span>
          </Link>
        </div>

        {/* Menu Header */}
        <header className="relative flex flex-col items-center p-4 bg-white shadow-md">
          <div className="flex justify-between items-center w-full">
            <Link href="/">
              <img src="/images/logo.svg" alt="Logo" className="h-10" />
            </Link>
            <button onClick={toggleMenu} className="p-2 text-gray-600">
              <MenuOutlined />
            </button>
          </div>
          {isMenuOpen && (
            <div className="absolute top-16 right-0 bg-white shadow-md rounded-md p-4 w-full z-10">
              <ul className="text-center">
                <li>
                  <Link href="/about" className="block py-2 hover:text-[#704d25]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contactus" className="block py-2 hover:text-[#704d25]">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="block py-2 hover:text-[#704d25]">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </header>
      </div>
    );
}
