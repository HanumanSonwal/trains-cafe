'use client';

import React from 'react';
import { Typography, Image } from 'antd';

const { Title, Paragraph } = Typography;

export default function HeroSection() {
  return (
    <div className="relative bg-red-600 text-white py-16 text-center">
  
      <Image
        src="/images/trainBanner.webp" 
        alt="Train"
        preview={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          opacity: 0.3, 
          textAlign:'left'
        }}
      />


      <div className="relative z-10 max-w-xl mx-auto">
        <Title level={2} className="!text-white !text-5xl font-bold">
          Delicious Food
        </Title>
        <Paragraph className="!text-white !text-2xl mt-4">
          Delivery in Train
        </Paragraph>
      </div>
    </div>
  );
}
