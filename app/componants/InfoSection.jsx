import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClockCircleOutlined, SearchOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';

const InfoSection = () => {
  const menuItems = [
    {
      icon: <ShoppingOutlined className="text-2xl" />,
      title: "Online Order Food In Your Journey",
      href: "/food-order",
      position: "translate-x-0"
    },
    {
      icon: <ClockCircleOutlined className="text-2xl" />,
      title: "Check Train Time-Table",
      href: "/time-table",
      position: "translate-x-4"
    },
    {
      icon: <SearchOutlined className="text-2xl" />,
      title: "Check PNR Status",
      href: "/pnr-status",
      position: "translate-x-8"
    },
    {
      icon: <UserOutlined className="text-2xl" />,
      title: "Check Coach Position",
      href: "/coach-position",
      position: "translate-x-12"
    }
  ];

  return (
    <div className="max-w-[575px] mx-auto p-6 bg-gray-50">
    
      <Title style={{ color: '#704D25' }} level={3} className="text-3xl font-semibold mb-6 text-center">
      More Information
          </Title>
      <div className="flex flex-col gap-6">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 10 }}
              className={`${item.position} group bg-[#704d25] text-white hover:text-gray-700 rounded-lg p-2 cursor-pointer 
                         transition-all duration-300 hover:bg-gray-200 relative hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-white text-gray-700 shadow-sm 
                                group-hover:shadow-md transition-all duration-300  hover:text-gray-700">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="text-gray-400 mr-2"
                >
                  →
                </motion.div>
              </div>
              <div className="absolute left-0 top-0 w-1 h-full bg-gray-300 rounded-l-lg 
                            group-hover:h-full group-hover:bg-gray-400 transition-all duration-300" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;