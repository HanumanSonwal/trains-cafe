'use client'

import React, { useState } from 'react';
import { Card, Rate, Collapse } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // Import useRouter

const { Panel } = Collapse;

const arrivalStations = () => {
  const [activeKey, setActiveKey] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const stations = [
    { 
      name: 'Ajmer Jn', 
      code: 'AII', 
      arrivalTime: '6:40 AM',
      vendors: [
        { name: 'NAKSHATRA FOOD AND BEV', rating: 4.5, reviews: 4000, servingTime: '05:00 to 23:15', minOrder: 149, preparationTime: 45 },
        { name: 'Ajmer Special Foods', rating: 4.2, reviews: 2000, servingTime: '06:00 to 22:00', minOrder: 99, preparationTime: 30 },
      ]
    },
    { 
      name: 'Marwar Jn', 
      code: 'MJ', 
      arrivalTime: '8:50 AM',
      vendors: [
        { name: 'Marwar Delights', rating: 4.3, reviews: 3000, servingTime: '07:00 to 21:00', minOrder: 129, preparationTime: 40 },
      ]
    },
    { 
      name: 'Abu Road', 
      code: 'ABR', 
      arrivalTime: '11:20 AM',
      vendors: [
        { name: 'Abu Road Treats', rating: 4.6, reviews: 5000, servingTime: '06:30 to 23:30', minOrder: 159, preparationTime: 35 },
        { name: 'Mountain View Cafe', rating: 4.4, reviews: 3500, servingTime: '08:00 to 22:00', minOrder: 139, preparationTime: 50 },
      ]
    },
  ];

  const handleRedirect = () => {
    router.push('/menu'); // Redirect to /menu
  };

  const renderVendorCard = (vendor) => (
    <Card className="shadow-md mb-4" key={vendor.name}>
      <div className="flex items-start">
        <img src="/images/special-veg-thali.jpg" alt="Food" className="w-24 h-24 object-cover mr-4" />
        <div>
          <h2 className="text-lg font-semibold">{vendor.name}</h2>
          <Rate allowHalf defaultValue={vendor.rating} className="text-sm" />
          <span className="text-gray-500 text-sm ml-2">{vendor.reviews}+ reviews</span>
          <p className="text-sm mt-1">
            Serving From <span className="font-semibold">{vendor.servingTime}</span>
          </p>
          <div className="flex items-center mt-1">
            <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded mr-2">V</span>
            <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-2">N</span>
            <span className="text-sm">Min Order ₹ {vendor.minOrder}</span>
            <ClockCircleOutlined className="ml-2 mr-1" />
            <span className="text-sm">{vendor.preparationTime} MIN</span>
          </div>
        </div>
      </div>
      <button 
        className="mt-4  px-4 py-2 rounded foot-menu-btn transition duration-300"
        onClick={handleRedirect} // Trigger redirection when button is clicked
      >
        Food Menu
      </button>
    </Card>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Food in AII-ADI INTERCITY EXPRESS (19412) Train</h1>
      
      <div className="bg-gray-100 p-2 mb-4">
        <span className="font-semibold">Journey Date:</span> 01-Oct-2024
      </div>
      
      <Collapse 
        accordion 
        activeKey={activeKey} 
        onChange={setActiveKey}
      >
        {stations.map((station, index) => (
          <Panel 
            key={index} 
            header={
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{station.name}</span> ({station.code})
                </div>
                <div className="text-sm">
                  Arrival: 1 Oct @ {station.arrivalTime}
                </div>
              </div>
            }
          >
            {station.vendors.map(renderVendorCard)}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default arrivalStations;
