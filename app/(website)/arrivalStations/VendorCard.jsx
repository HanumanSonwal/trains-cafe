import { Card, Rate, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

function VendorCard({ stationName }) {
  const router = useRouter(); 
  const [vendors, setVendors] = useState([]); 


  const fetchVendors = async () => {
   
    try {
      const response = await fetch(
        `http://localhost:3000/api/vendors?search=${stationName}`
      ); 
      const data = await response.json();
      setVendors(data.data || []); 
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };

  useEffect(() => {
    fetchVendors(); 
  }, [stationName]); 

  const handleRedirect = () => {
    router.push('/menu');
  };


  return (
    <div>
  
      {vendors.map((vendor, index) => (
           <Card className="shadow-md mb-4" key={index} style={{ margin: '10px 0' }}>
            <div className="flex items-start">
              <img
                src="/images/special-veg-thali.jpg"
                alt="Food"
                className="w-24 h-24 object-cover mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">{vendor.Vendor_Name}</h2>
                {/* <Rate allowHalf defaultValue={vendor.rating} className="text-sm" /> */}
                {/* <span className="text-gray-500 text-sm ml-2">{vendor.reviews}+ reviews</span> */}
                <p className="text-sm mt-1">
                  Serving From <span className="font-semibold">{vendor.servingTime}</span>
                </p>
                <div className="flex items-center mt-1">
                  <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded mr-2">V</span>
                  <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-2">N</span>
                  <span className="text-sm">Min Order ₹ {vendor.Min_Order_Value}</span>
                  <ClockCircleOutlined className="ml-2 mr-1" />
                  <span className="text-sm">{vendor.Min_Order_Time} MIN</span>
                </div>
              </div>
            </div>
            <button 
              className="mt-4 px-4 py-2 rounded foot-menu-btn transition duration-300"
              onClick={handleRedirect} 
            >
              Food Menu
            </button>
          </Card>
        ))}
    </div>
  );
}

export default VendorCard;
