// "use client";

// import React from "react";
// import { Button } from "antd";
// import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
// import Link from "next/link";

// const HeroSection = () => {
//   return (
//     <div className="hero-banner">
    
//       <div className="p-3">
//         <div className="text-left mt-10 mx-auto relative">
//           <img
//             src="/images/Tastyfood.png"
//             alt="Hero Title Background"
//             className="absolute  transform  -translate-y-1/2"
            
//             // style={{ top: "-25px" }}
//           />

//           <h2
//             className="text-white font-bold relative"
           
//           >
//             Munching Through <br /> The Miles!
//           </h2>

//           <div className="flex gap-2 mt-4">
//           <Link href='tel:090909090'>
//             <Button          
//               type="btn"
//               className="common-btn border-none rounded-full px-4 py-2  font-[600]"
//               icon={<PhoneOutlined />}
              
//             >
//               Order via Call
//             </Button>
//             </Link>
//             <Link href='https://wa.me/090909090'>
//             <Button
//               type="btn"
//               className="common-btn-outline border rounded-full px-4 py-2  font-[600] hover:bg-[#704D25] hover:text-white"
//               icon={
//                 <WhatsAppOutlined
//                   style={{
//                     color: "#fff",
//                     backgroundColor: "#34a853",
//                     borderRadius: "30px",
//                   }}
//                 />
//               }
//             >
//               Order via WhatsApp
//             </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;
// "use client";

// import React, { useEffect, useState } from "react";
// import { Button, Carousel } from "antd";
// import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
// import Link from "next/link";

// const HeroSection = () => {
//   const [carouselImages, setCarouselImages] = useState([]);

//   useEffect(() => {
//     const fetchCarouselData = async () => {
//       try {
//         const response = await fetch("/api/advertisements?slug=Banner"); 
     
//         if (!response.ok) {
//           console.error(`Error: ${response.status} ${response.statusText}`);
//           return;
//         }
  
//         const data = await response.json();
//         console.log('Carousel Data:', data); 
        
//         setCarouselImages(data.images || []); 
//       } catch (error) {
//         console.error("Error fetching carousel data:", error);
//       }
//     };
  
//     fetchCarouselData();
//   }, []);
  

//   return (
//     <div className="relative hero-banner">
//       <Carousel autoplay className="w-full">
//         {carouselImages.length > 0 ? (
//           carouselImages.map((image, index) => (
//             <div key={index}>
//               <div
//                 className="w-full h-[23vh] sm:h-[35vh] md:h-[50vh] bg-center bg-cover bg-no-repeat"
//                 style={{ backgroundImage: `url(${image.url})` }} 
//               />
//             </div>
//           ))
//         ) : (
//           <div className="w-full h-[23vh] sm:h-[35vh] md:h-[50vh] bg-gray-200 flex items-center justify-center">
//             <p>Loading...</p>
//           </div>
//         )}
//       </Carousel>

//       <div className="absolute top-0 left-0 w-full h-full">
//         <div className="p-3">
//           <div className="text-left mt-10 mx-auto relative">
//             <img
//               src="/images/Tastyfood.png"
//               alt="Hero Title Background"
//               className="absolute transform -translate-y-1/2"
//             />

//             <h2 className="text-white font-bold relative text-lg sm:text-2xl md:text-4xl">
//               Munching Through <br /> The Miles!
//             </h2>

//             <div className="flex gap-2 mt-4">
//               <Link href="tel:090909090">
//                 <Button
//                   type="primary"
//                   className="common-btn border-none rounded-full px-4 py-2 font-semibold bg-[#704D25] hover:bg-[#5a3d1d] flex items-center"
//                   icon={<PhoneOutlined />}
//                 >
//                   Order via Call
//                 </Button>
//               </Link>

//               <Link href="https://wa.me/090909090">
//                 <Button
//                   className="common-btn-outline border rounded-full px-4 py-2 font-semibold text-black hover:bg-[#704D25] hover:text-white flex items-center"
//                   icon={
//                     <WhatsAppOutlined className="bg-[#34a853] rounded-full" />
//                   }
//                 >
//                   Order via WhatsApp
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;



// "use client";

// import React from "react";
// import { Button } from "antd";
// import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
// import Link from "next/link";

// const HeroSection = () => {
//   return (
//     <div className="hero-banner">
    
//       <div className="p-3">
//         <div className="text-left mt-10 mx-auto relative">
//           <img
//             src="/images/Tastyfood.png"
//             alt="Hero Title Background"
//             className="absolute  transform  -translate-y-1/2"
            
//             // style={{ top: "-25px" }}
//           />

//           <h2
//             className="text-white font-bold relative"
           
//           >
//             Munching Through <br /> The Miles!
//           </h2>

//           <div className="flex gap-2 mt-4">
//           <Link href='tel:090909090'>
//             <Button          
//               type="btn"
//               className="common-btn border-none rounded-full px-4 py-2  font-[600]"
//               icon={<PhoneOutlined />}
              
//             >
//               Order via Call
//             </Button>
//             </Link>
//             <Link href='https://wa.me/090909090'>
//             <Button
//               type="btn"
//               className="common-btn-outline border rounded-full px-4 py-2  font-[600] hover:bg-[#704D25] hover:text-white"
//               icon={
//                 <WhatsAppOutlined
//                   style={{
//                     color: "#fff",
//                     backgroundColor: "#34a853",
//                     borderRadius: "30px",
//                   }}
//                 />
//               }
//             >
//               Order via WhatsApp
//             </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;
"use client";

import React from 'react';
import { Button, Carousel } from "antd";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Link from "next/link";

const HeroSection = () => {
  const carouselImages = [
    '/images/herobanner.png',
    '/images/herobanner.png',
    '/images/herobanner.png'
  ];

  return (
    <div className="relative hero-banner">
      <Carousel
        autoplay
        className="w-full"
      >
        {carouselImages.map((image, index) => (
          <div key={index}>
            <div 
              className="w-full h-[20vh] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}
      </Carousel>

      {/* Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="p-3">
          <div className="text-left mt-10 mx-auto relative">
            <img
              src="/images/Tastyfood.png"
              alt="Hero Title Background"
              className="absolute transform -translate-y-1/2"
            />

            <h2 className="text-white font-bold relative">
              Munching Through <br /> The Miles!
            </h2>

            <div className="flex gap-2 mt-4">
              <Link href='tel:090909090'>
                <Button
                  type="primary"
                  className="common-btn border-none rounded-full px-4 py-2 font-semibold bg-[#704D25] hover:bg-[#5a3d1d] flex items-center"
                  icon={<PhoneOutlined />}
                >
                  Order via Call
                </Button>
              </Link>
              
              <Link href='https://wa.me/090909090'>
                <Button
                  className="common-btn-outline border rounded-full px-4 py-2 font-semibold text-black hover:bg-[#704D25] hover:text-white flex items-center"
                  icon={
                    <WhatsAppOutlined
                      className="bg-[#34a853] rounded-full"
                    />
                  }
                >
                  Order via WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;