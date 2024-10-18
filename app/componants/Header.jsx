"use client";

import { useState, useEffect, useRef } from 'react';
import { PhoneOutlined, WhatsAppOutlined, MenuOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const cartItems = useSelector((state) => state.cart.items);

    // // Count total quantity for the cart badge icon in the header
    // const cartItemCount = Object.values(cartItems).reduce((acc, count) => acc + count, 0);

    // Count total unique items for the cart icon in the cart section
    const totalUniqueItems = Object.keys(cartItems).length;

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.menu-button')) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
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

            {/* Header */}
            <header className="relative flex flex-col items-center p-4 bg-white shadow-md">
                <div className="flex justify-between items-center w-full">
                    <Link href="/">
                        <img src="/images/logo.svg" alt="Logo" className="h-10" />
                    </Link>

                    {/* Cart icon in header showing total quantity */}
                    <Link href="/cart">
                        <Badge count={totalUniqueItems} showZero={true}>
                            <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                        </Badge>
                    </Link>
                </div>

                {isMenuOpen && (
                    <div ref={menuRef} className="absolute top-16 right-0 bg-white shadow-md rounded-md p-4 w-full z-10">
                        <ul className="text-center">
                            <li>
                                <Link href="/web-pages/about-us" className="block py-2 hover:text-[#704d25]" onClick={handleMenuItemClick}>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/web-pages/contact-us" className="block py-2 hover:text-[#704d25]" onClick={handleMenuItemClick}>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="block py-2 hover:text-[#704d25]" onClick={handleMenuItemClick}>
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
