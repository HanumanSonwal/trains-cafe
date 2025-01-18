// import React from "react";
// import { Button } from "antd";
// import Link from "next/link";

// const PromoBanner = () => {
//   return (
//     <div
//       className="relative mb-4 py-8  w-full h-[230px] overflow-hidden rounded-lg max-w-[575px] mx-auto bg-cover bg-center"
//       style={{ backgroundImage: "url('/images/promo.png')" }}
//     >
//       <div className="absolute right-0 top-0 bottom-0  sm:w-1/2 flex flex-col justify-center items-start p-4 sm:p-8">
//         <div className="relative mb-4 w-full">
//           <img
//             src="/images/Offer.png"
//             alt="Title Overlay"
//             className="absolute left-1/4 transform -translate-x-1/2 -translate-y-1/2 "
//           />
//           <h2 className="relative text-white text-xl sm:text-2xl z-10 font-bold leading-tight">
//             Exclusive Offer,
//             <br />
//             Grab It Soon
//           </h2>
//         </div>
//         <Link href='tel:090909090'>
//         <Button
//           type="btn"
//           className="common-btn text-white border-none  text-sm font-[600]"
//         >
//           Order Now
//         </Button>
//         </Link>
//       </div>

//       <div className="absolute top-0 right-0 flex flex-col items-center">
//         <div className="bg-red-600 text-white py-1 px-2 sm:px-3 transform skew-x-[-15deg] text-center">
//           <span className="text-xs sm:text-sm font-bold">50%</span>
//         </div>
//         <div className="bg-red-700 text-white py-1 px-2 sm:px-3 transform skew-x-[-15deg] text-center">
//           <span className="text-xs sm:text-sm font-bold">OFF</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PromoBanner;

'use client'
import React from 'react';
import { Button, Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Link from 'next/link';

const PromoBanner = () => {
  const carouselRef = React.useRef();
  
  // Sample carousel images - replace with your actual images
  const images = [
    '/images/promo.png',
    '/images/promo.png',
    '/images/promo.png',
  ];

  // const nextSlide = () => {
  //   carouselRef.current?.next();
  // };

  // const prevSlide = () => {
  //   carouselRef.current?.prev();
  // };

  // Carousel settings for smooth sliding
  const carouselSettings = {
    effect: 'fade',          // Use fade effect for smooth transitions
    autoplay: true,          // Enable autoplay
    autoplaySpeed: 3000,     // Time between slides (in ms)
    fade: true,             // Enable fade transition
    speed: 1000,            // Transition speed (in ms)
    easing: 'ease-in-out',  // Smooth easing function
    
  };

  return (
    <div className="relative mb-4 w-full h-[230px] overflow-hidden rounded-lg max-w-[575px] mx-auto">
      {/* Carousel container */}
      <Carousel {...carouselSettings} ref={carouselRef}>
        {images.map((img, index) => (
          <div key={index} className="h-[230px]">
            <div 
              className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
              style={{ 
                backgroundImage: `url(${img})`,
              }}
            />
          </div>
        ))}
      </Carousel>
      
      {/* Carousel controls with smooth hover effect */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-300 ease-in-out z-10 hover:scale-105"
      >
        <LeftOutlined className="text-lg" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-300 ease-in-out z-10 hover:scale-105"
      >
        <RightOutlined className="text-lg" />
      </button> */}

      {/* Promo content overlay */}
      <div className="absolute right-0 top-0 bottom-0 sm:w-1/2 flex flex-col justify-center items-start p-4 sm:p-8 z-10">
        <div className="relative mb-4 w-full">
          <img
            src="/images/Offer.png"
            alt="Title Overlay"
            className="absolute left-1/4 -translate-x-1/2 -translate-y-1/2"
          />
          <h2 className="relative text-white text-xl sm:text-2xl font-bold leading-tight">
            Exclusive Offer,
            <br />
            Grab It Soon
          </h2>
        </div>
        <Link href="tel:090909090">
          <Button
            type="primary"
            className="common-btn text-white border-none text-sm font-semibold"
          >
            Order Now
          </Button>
        </Link>
      </div>

      {/* Discount badge */}
      <div className="absolute top-0 right-0 flex flex-col items-center z-10">
        <div className="bg-red-600 text-white py-1 px-2 sm:px-3 transform -skew-x-12">
          <span className="text-xs sm:text-sm font-bold">50%</span>
        </div>
        <div className="bg-red-700 text-white py-1 px-2 sm:px-3 transform -skew-x-12">
          <span className="text-xs sm:text-sm font-bold">OFF</span>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;