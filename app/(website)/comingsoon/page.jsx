'use client';

import React from 'react';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const ComingSoonPage = () => {
  return (
    <div className="flex items-center justify-center py-5 text-white text-center">
      <div className="p-6 rounded-lg shadow-lg bg-white-800">
        <Title className="text-5xl font-bold  hover:text-red-800 transition duration-800">Coming Soon!</Title>
        <Paragraph className="text-lg mt-4 hover:text-red-600 transition duration-600">
          We're working hard to bring you something amazing. Stay tuned for updates!
        </Paragraph>
        <Button
          type="primary"
          className="order-btn mt-6 hover:bg-blue-600 transition duration-300"
          onClick={() => alert('Thank you for your interest!')}
        >
          Join Our Mailing List
        </Button>
      </div>
    </div>
  );
};

export default ComingSoonPage;
