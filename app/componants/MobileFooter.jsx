"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  HomeOutlined,
  ToolOutlined,
  FileTextOutlined,
  GiftOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Space } from "antd";
import Link from "next/link";

const MobileFooter = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.closest(".menu-button")
    ) {
      closeMenu();
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <footer className="fixed bottom-0 left-0 z-50 right-0 bg-white shadow-md max-w-[575px] w-full mx-auto">
        <div>
          <Space className="w-full py-3 px-4 flex justify-between items-center">
            <FooterItem icon={<HomeOutlined />} text="Home" link="/" />
            <FooterItem icon={<ToolOutlined />} text="Services" link="/all-services" />
            <FooterItem
              icon={<FileTextOutlined />}
              text="Blogs"
              link="/blog"
            />
            <FooterItem icon={<GiftOutlined />} text="Offers" link="/offers" />
            <button
              onClick={toggleMenu}
              className="menu-button flex flex-col items-center font-bold text-[#000] hover:text-[#704D25]"
            >
              <span className="text-xl">
                <MenuOutlined />
              </span>
              <span className="text-xs mt-1">Menu</span>
            </button>
          </Space>
        </div>
      </footer>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-0 bottom-0 bg-white z-50 shadow-lg overflow-y-auto"
          style={{
            width: "50%",
            maxWidth: "287.5px",
            left: "50%",
            transform: "translateX(0)",
            height: "100vh",
            maxHeight: "100vh",
          }}
        >
          <div className="p-4 flex justify-end">
            <button onClick={toggleMenu}>
              <CloseOutlined className="text-2xl" />
            </button>
          </div>
          <div className="p-4">
            <nav className="space-y-4">
              <Link
                href="/group-food-ordering-in-train"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Group Food Ordering in Train
              </Link>
              <Link
                href="/contact-us"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Contact Us
              </Link>
              <Link
                href="/about-us"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link
                href="/online-coolie-booking"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Online Coolie Services
              </Link>
              <Link
                href="/online-hotel-booking"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Online Hotel Booking Services
              </Link>
              <Link
                href="/faq"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link
                href="/terms-and-conditions"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Privacy Policy
              </Link>
              <Link
                href="/cancellation-policy"
                className="block text-sm font-bold"
                onClick={closeMenu}
              >
                Cancellation Policy
              </Link>

              <div className="mt-4">
                <p className="text-sm font-bold">Contact Info</p>
                <p className="text-sm">
                  <a
                    class="font-medium text-sm text-blue-600 hover:text-blue-800 underline"
                    href="tel:+918696963496"
                  >
                    +91-8696963496
                  </a>
                </p>

                <p className="text-sm">
                  <a
                    class="font-medium text-sm text-blue-600 hover:text-blue-800 underline"
                    href="support@trainscafe.in"
                  >
                    support@trainscafe.in
                  </a>
                </p>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

const FooterItem = ({ icon, text, link }) => (
  <Link
    href={link}
    className="flex flex-col items-center font-bold text-[#000] hover:text-[#704D25]"
  >
    <span className="text-xl">{icon}</span>
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

export default MobileFooter;
