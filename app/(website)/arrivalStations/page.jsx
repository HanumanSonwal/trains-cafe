// 'use client'

// import React, { useState } from 'react';
// import { Card, Rate, Collapse } from 'antd';
// import { ClockCircleOutlined } from '@ant-design/icons';
// import { useRouter } from 'next/navigation'; // Import useRouter
// import VendorCard from './VendorCard';

// const { Panel } = Collapse;

// const ArrivalStations = () => {  // Renamed to start with an uppercase letter
//   const [activeKey, setActiveKey] = useState(null);
//   const router = useRouter(); // Initialize useRouter

//   const stations = [
//     {
//       name: 'Ajmer Jn',
//       code: 'AII',
//       arrivalTime: '6:40 AM',
//       vendors: [
//         { name: 'NAKSHATRA FOOD AND BEV', rating: 4.5, reviews: 4000, servingTime: '05:00 to 23:15', minOrder: 149, preparationTime: 45 },
//         { name: 'Ajmer Special Foods', rating: 4.2, reviews: 2000, servingTime: '06:00 to 22:00', minOrder: 99, preparationTime: 30 },
//       ]
//     },
//     {
//       name: 'Marwar Jn',
//       code: 'MJ',
//       arrivalTime: '8:50 AM',
//       vendors: [
//         { name: 'Marwar Delights', rating: 4.3, reviews: 3000, servingTime: '07:00 to 21:00', minOrder: 129, preparationTime: 40 },
//       ]
//     },
//     {
//       name: 'Abu Road',
//       code: 'ABR',
//       arrivalTime: '11:20 AM',
//       vendors: [
//         { name: 'Abu Road Treats', rating: 4.6, reviews: 5000, servingTime: '06:30 to 23:30', minOrder: 159, preparationTime: 35 },
//         { name: 'Mountain View Cafe', rating: 4.4, reviews: 3500, servingTime: '08:00 to 22:00', minOrder: 139, preparationTime: 50 },
//       ]
//     },
//   ];

//   const handleRedirect = () => {
//     router.push('/menu'); // Redirect to /menu
//   };

//   const renderVendorCard = (vendor) => (
//     <Card className="shadow-md mb-4" key={vendor.name}>
//       <div className="flex items-start">
//         <img src="/images/special-veg-thali.jpg" alt="Food" className="w-24 h-24 object-cover mr-4" />
//         <div>
//           <h2 className="text-lg font-semibold">{vendor.name}</h2>
//           <Rate allowHalf defaultValue={vendor.rating} className="text-sm" />
//           <span className="text-gray-500 text-sm ml-2">{vendor.reviews}+ reviews</span>
//           <p className="text-sm mt-1">
//             Serving From <span className="font-semibold">{vendor.servingTime}</span>
//           </p>
//           <div className="flex items-center mt-1">
//             <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded mr-2">V</span>
//             <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-2">N</span>
//             <span className="text-sm">Min Order ₹ {vendor.minOrder}</span>
//             <ClockCircleOutlined className="ml-2 mr-1" />
//             <span className="text-sm">{vendor.preparationTime} MIN</span>
//           </div>
//         </div>
//       </div>
//       <button
//         className="mt-4 px-4 py-2 rounded foot-menu-btn transition duration-300"
//         onClick={handleRedirect} // Trigger redirection when button is clicked
//       >
//         Food Menu
//       </button>
//     </Card>
//   );

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Order Food in AII-ADI INTERCITY EXPRESS (19412) Train</h1>

//       <div className="bg-gray-100 p-2 mb-4">
//         <span className="font-semibold">Journey Date:</span> 01-Oct-2024
//       </div>

//       <Collapse
//         accordion
//         activeKey={activeKey}
//         onChange={setActiveKey}
//       >
//         {stations.map((station, index) => (
//           <Panel
//             key={index}
//             header={
//               <div className="flex justify-between items-center">
//                 <div>
//                   <span className="font-semibold">{station.name}</span> ({station.code})
//                 </div>
//                 <div className="text-sm">
//                   Arrival: 1 Oct @ {station.arrivalTime}
//                 </div>
//               </div>
//             }
//           >
//             {station.vendors.map(renderVendorCard)}
//           </Panel>
//         ))}
//       </Collapse>

//       <VendorCard/>
//     </div>
//   );
// };

// export default ArrivalStations; // Export the component

// 'use client';
// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { message, Table } from "antd";

// const ArrivalStations = () => {
//   const searchParams = useSearchParams();
//   const trainNo = searchParams.get("trainNo");
//   const trainName = searchParams.get("trainName");
//   const journeyDate = searchParams.get("date"); // Fetch the date from query parameters
//   const [upcomingStations, setUpcomingStations] = useState([]);

//   console.log(upcomingStations, "upcomingStations");

//   useEffect(() => {
//     const fetchUpcomingStations = async () => {
//       try {
//         // Check if date is available
//         if (!journeyDate) {
//           throw new Error("Date is missing from query parameters.");
//         }

//         const response = await fetch(
//           `/api/rapid/live?trainNo=${trainNo}&date=${journeyDate}`
//         );
//         const result = await response.json();
//         console.log(result, "result");

//         if (response.ok && result.data.success) {
//           setUpcomingStations(result.data.upcoming_stations);
//         } else {
//           throw new Error(result.message || "Failed to fetch station data.");
//         }
//       } catch (error) {
//         message.error(`Error: ${error.message}`);
//       }
//     };

//     if (trainNo) {
//       fetchUpcomingStations();
//     }
//   }, [trainNo, journeyDate]);

//   const columns = [
//     {
//       title: "Station Name",
//       dataIndex: "station_name",
//       key: "station_name",
//     },
//     {
//       title: "Station Code",
//       dataIndex: "station_code",
//       key: "station_code",
//     },
//     {
//       title: "Arrival Time",
//       dataIndex: "eta",
//       key: "eta",
//     },
//     {
//       title: "Departure Time",
//       dataIndex: "etd",
//       key: "etd",
//     },
//     {
//       title: "Platform",
//       dataIndex: "platform_number",
//       key: "platform_number",
//     },
//     {
//       title: "Distance from Source",
//       dataIndex: "distance_from_source",
//       key: "distance_from_source",
//     },
//   ];

//   return (
//     <div className="px-6 py-4">
//       <h2 className="text-2xl font-bold mb-4">
//         Train No: {trainNo} - {trainName}
//       </h2>
//       <Table
//         columns={columns}
//         dataSource={upcomingStations}
//         rowKey="si_no"
//         pagination={false}
//       />
//     </div>
//   );
// };

// export default ArrivalStations;

"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { message, Collapse } from "antd";
import VendorCard from "./VendorCard";

const { Panel } = Collapse;

const ArrivalStations = () => {
  const searchParams = useSearchParams();
  const trainNo = searchParams.get("trainNo");
  const trainName = searchParams.get("trainName");
  const journeyDate = searchParams.get("date");
  const [upcomingStations, setUpcomingStations] = useState([
    {
      station_name: "jaipur",
      station_code: "CEN",
      eta: "10:30 AM",
    },
  ]);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const fetchUpcomingStations = async () => {
      try {
        if (!journeyDate) {
          throw new Error("Date is missing from query parameters.");
        }

        const response = await fetch(
          `/api/rapid/live?trainNo=${trainNo}&date=${journeyDate}`
        );
        const result = await response.json();

        if (response.ok && result.data.success) {
          setUpcomingStations(result.data.upcoming_stations);
          console.log(result.data.upcoming_stations); // Log the upcoming stations
        } else {
          throw new Error(result.message || "Failed to fetch station data.");
        }
      } catch (error) {
        message.error(`Error: ${error.message}`);
      }
    };

    if (trainNo) {
      // fetchUpcomingStations();
    }
  }, [trainNo, journeyDate]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Order Food in {trainName} ({trainNo}) Train
      </h1>

      <div className="bg-gray-100 p-2 mb-4">
        <span className="font-semibold">Journey Date:</span> {journeyDate}
      </div>

      <Collapse accordion activeKey={activeKey} onChange={setActiveKey}>
        {upcomingStations?.map((station, index) => (
          <Panel
            key={index}
            header={
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{station.station_name}</span>{" "}
                  ({station.station_code})
                </div>
                <div className="text-sm">Arrival: {station.eta}</div>
              </div>
            }
          >
            <VendorCard
              train={{
                trainNo,
                trainName,
              }}
              station={station}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ArrivalStations;
