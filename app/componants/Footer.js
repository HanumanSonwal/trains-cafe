"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";

const Footer = () => {
  const [showTopNavigation, setShowTopNavigation] = useState(false);

  const handleScroll = () => {
    const halfScrollHeight = document.documentElement.scrollHeight / 2;
    const currentScrollPosition = window.scrollY + window.innerHeight;

    if (currentScrollPosition > halfScrollHeight) {
      setShowTopNavigation(true);
    } else {
      setShowTopNavigation(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const duration = 1000;
    const start = window.scrollY;
    const startTime = performance.now();

    const easeInOutQuad = (t) => {
      return t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
    };

    const scrollStep = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = easeInOutQuad(progress);
      const scrollPosition = start - easing * start;

      window.scrollTo(0, scrollPosition);

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    };

    requestAnimationFrame(scrollStep);
  };

  return (
    <>
      <footer
        className="py-8"
        style={{
          marginBottom: "45px",
          height: "auto",
          backgroundImage: 'url("/images/footer-background.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <img
                  src="/images/logo.svg"
                  alt="Company Logo"
                  className="w-24 mx-auto sm:mx-0 mb-4"
                />
                <p className="text-sm text-[#3A3A3A]">
                  We are dedicated to providing the best food service for
                  travelers. Our commitment is to ensure a delightful journey
                  with quality food and excellent service.
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-0">
                  <li>
                    <a
                      href="/about"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contactus"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Blogs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Bulk Food Order in Train
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Track Order
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-md font-semibold mb-4">Important Links</h4>
                <ul className="space-y-0">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Help & Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Request Call Back
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Complained and Feedback
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Cancellation Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">
                  Indian Railway info.
                </h4>
                <ul className="space-y-0">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      PNR Status Check
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Train Coach Position
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      IRCTC Train Schedule
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Platform Locator
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Check PNR Status on Whatsapp
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 text-sm hover:text-gray-800"
                    >
                      Track Live Train Running Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center py-2 border-t border-gray-200">
            <div className="text-gray-600 text-center  mb-4 md:mb-0">
              <p style={{ fontSize: "12px" }}>
                Copyright 2024 @ Trainscafe.com
              </p>
            </div>

            <div className="flex justify-center md:justify-end items-center space-x-4">
              {showTopNavigation && (
                <a
                  href="#"
                  className="text-white top-navigation hover:bg-[#D49929] p-2 bg-[#704D25] rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTop();
                  }}
                >
                  <ArrowUpOutlined className="text-lg" />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
