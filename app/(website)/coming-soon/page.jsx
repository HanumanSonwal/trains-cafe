'use client';

import React from 'react';
import { Typography, Button } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const ComingSoonPage = () => {
  return (
    <div className="flex items-center justify-center py-5 text-white text-center">
      <div className="p-6 rounded-lg shadow-lg bg-white-800">
        <Title className="text-5xl font-bold  hover:text-red-800 transition duration-800">Coming Soon!</Title>
        <Paragraph className="text-lg mt-4 hover:text-red-600 transition duration-600">
          We are working hard to bring you something amazing. Stay tuned for updates!
        </Paragraph>
         <div className="text-center">
              <Link href="/contact-us" passHref>
                 <Button
                    type="btn"
                    className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600] hover:bg-[#D49929] hover:text-[#ffffff]"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
      </div>
     
    </div>
  );
};

export default ComingSoonPage;
