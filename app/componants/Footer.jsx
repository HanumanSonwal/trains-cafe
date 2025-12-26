// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   ArrowUpOutlined,
//   FacebookFilled,
//   InstagramFilled,
//   LinkedinFilled,
//   XOutlined,
//   YoutubeFilled,
// } from "@ant-design/icons";
// import Link from "next/link";

// const Footer = () => {
//   const [showTopNavigation, setShowTopNavigation] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const halfScrollHeight = document.documentElement.scrollHeight / 2;
//       const currentScrollPosition =
//         document.documentElement.scrollY + document.documentElement.innerHeight;

//       if (currentScrollPosition > halfScrollHeight) {
//         setShowTopNavigation(true);
//       } else {
//         setShowTopNavigation(false);
//       }
//     };

//     document.documentElement.addEventListener("scroll", handleScroll);

//     return () => {
//       document.documentElement.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const scrollToTop = () => {
//     const duration = 1000;
//     const element = document.documentElement;
//     const start = element.scrollTop;
//     const startTime = performance.now();

//     const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

//     const scrollStep = (currentTime) => {
//       const timeElapsed = currentTime - startTime;
//       const progress = Math.min(timeElapsed / duration, 1);
//       const easing = easeInOutQuad(progress);
//       const scrollPosition = start - easing * start;

//       element.scrollTo(0, scrollPosition);

//       if (progress < 1) {
//         requestAnimationFrame(scrollStep);
//       }
//     };

//     requestAnimationFrame(scrollStep);
//   };

//   return (
//     <>
//       <footer
//         className="py-8"
//         style={{
//           marginBottom: "45px",
//           height: "auto",
//           backgroundImage: 'url("/images/footer-background.jpeg")',
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <div className="mx-auto px-4">
//           <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
//             <div className="space-y-4">
//               <div className="sm:text-left">
//                 <Link href="/">
//                   <img
//                     src="/images/logo.svg"
//                     alt="Company Logo"
//                     className="w-24  sm:mx-0 mb-4"
//                   />
//                 </Link>
//                 <p className="text-sm text-[#3A3A3A]">
//                   Trainscafe is your trusted partner for hygienic and delicious
//                   food delivery in train. We ensure fresh meals, timely service,
//                   and a satisfying travelers experience across 450+ railway
//                   stations in India.
//                 </p>
//               </div>
//               <div>
//                 <h4 className="text-md font-semibold mb-4">Quick Links</h4>
//                 <ul className="space-y-0 ">
//                   <li>
//                     <Link
//                       href="/about-us"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       About Us
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/contact-us"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Contact Us
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/blog"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Blogs
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/stations"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Stations
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/trains"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Trains
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/group-food-ordering-in-train"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Group Food Ordering in Train
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/online-coolie-booking"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Online Coolie Services{" "}
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/online-hotel-booking"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Online Hotel Booking Services
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/coming-soon"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Track Order
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="text-md font-semibold mb-4">Important Links</h4>
//                 <ul className="space-y-0">
//                   <li>
//                     <Link
//                       href="/terms-and-conditions"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Terms & Conditions
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/privacy-policy"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Privacy Policy
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/help-and-support"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Help & Support
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/coming-soon"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Request Call Back
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/complained-and-feedback"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Complained and Feedback
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/cancellation-policy"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Cancellation Policy
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/vendor-registration"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Vendor Registration
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="text-md font-semibold mb-4">
//                   Indian Railway info.
//                 </h4>
//                 <ul className="space-y-0">
//                   <li>
//                     <Link
//                       href="/pnr-status"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       PNR Status Check
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/train-coach-position"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Train Coach Position
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/irctc-train-schedule"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       IRCTC Train Schedule
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/platform-locator"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Platform Locator
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/order-food-in-train-from-whatsapp"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Order Food in Train on WhatsApp
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/train-running-status"
//                       className="text-gray-600 text-sm hover:text-gray-800"
//                     >
//                       Track Live Train Running Status
//                     </Link>
//                   </li>
//                 </ul>

//                 <div className="flex flex-row flex-wrap justify-center md:justify-start items-center gap-4 mt-4 text-[#3A3A3A]">
//                   <Link
//                     href="https://www.facebook.com/trainscafe"
//                     target="_blank"
//                     aria-label="Facebook"
//                     className="transition-transform duration-300 hover:scale-110"
//                   >
//                     <FacebookFilled className="text-2xl hover:text-[#1877F2] transition duration-300" />
//                   </Link>

//                   <Link
//                     href="https://x.com/trainscafe"
//                     target="_blank"
//                     aria-label="X (Twitter)"
//                     className="transition-transform duration-300 hover:scale-110"
//                   >
//                     <XOutlined className="text-2xl hover:text-black transition duration-300" />
//                   </Link>

//                   <Link
//                     href="https://www.linkedin.com/company/trainscafe"
//                     target="_blank"
//                     aria-label="LinkedIn"
//                     className="transition-transform duration-300 hover:scale-110"
//                   >
//                     <LinkedinFilled className="text-2xl hover:text-[#0A66C2] transition duration-300" />
//                   </Link>

//                   <Link
//                     href="https://www.instagram.com/trainscafe_/"
//                     target="_blank"
//                     aria-label="Instagram"
//                     className="transition-transform duration-300 hover:scale-110"
//                   >
//                     <InstagramFilled className="text-2xl hover:text-[#E1306C] transition duration-300" />
//                   </Link>

//                   <Link
//                     href="https://www.youtube.com/@trainscafe"
//                     target="_blank"
//                     aria-label="YouTube"
//                     className="transition-transform duration-300 hover:scale-110"
//                   >
//                     <YoutubeFilled className="text-2xl hover:text-[#FF0000] transition duration-300" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer Bottom */}
//           <div className="mt-8 flex flex-col md:flex-row items-center justify-center py-2 border-t border-gray-200">
//             <div className="text-gray-600 text-center  mb-4 md:mb-0">
//               <p style={{ fontSize: "12px" }}>Copyright 2025 @trainscafe.in</p>
//             </div>

//             <div className="flex justify-center md:justify-end items-center space-x-4">
//               {showTopNavigation && (
//                 <Link
//                   href="#"
//                   className="text-white top-navigation hover:bg-[#D49929] p-2 bg-[#704D25] rounded-full"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     scrollToTop();
//                   }}
//                 >
//                   <ArrowUpOutlined className="text-lg" />
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Footer;



import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <nav>
        <Link href="/about-us">About Us</Link>
        <Link href="/contact-us">Contact Us</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/stations">Stations</Link>
        <Link href="/trains">Trains</Link>
        <Link href="/vendor-registration">Vendor Registration</Link>
        <Link href="/terms-and-conditions">Terms</Link>
        <Link href="/privacy-policy">Privacy</Link>
      </nav>
    </footer>
  );
}
