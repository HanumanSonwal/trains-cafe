"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, DatePicker, Card, Typography } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

const StationPage = () => {
  const router = useRouter();
  const [selectedStation, setSelectedStation] = useState(null);
  const [journeyDate, setJourneyDate] = useState(dayjs('2024-09-01'));

  const stations = [
    { code: 'JP', name: 'Jaipur', time: '10:00' }, 
    { code: 'DO', name: 'Dausa', time: '08:52' },
    { code: 'GADJ', name: 'Gandhinagar Jaipur', time: '09:33' },
    { code: 'KSG', name: 'Kishangarh', time: '11:29' },
    { code: 'AII', name: 'Ajmer Jn', time: '12:10' },
    { code: 'BER', name: 'Beawar', time: '13:06' },
  ];

  const handleStationChange = (value) => {
    setSelectedStation(value);
    // Navigate to arrival station selection page
    router.push(`/arrivalStations?boardingStation=${value}&date=${journeyDate.format('YYYY-MM-DD')}`);
  };

  return (
    <div className="max-w-[575px] mx-auto p-6 bg-gray-50">
      <h2 className="text-[#704D25] mx-auto text-center p-6 text-2xl font-bold relative z-10">
        Order Food in <br />
        <span className="text-[#d6872a] text-xl">CORBET PRK LINK (25014)</span>
      </h2>

      {/* Journey Details Card */}
      <Card bordered={false} className="mb-6 p-5 shadow-lg rounded-lg bg-white">
        <Title level={4} className="mb-4 text-gray-700">Journey Details</Title>
        <div className="mb-4">
          <Text className="block text-base font-semibold text-gray-600 mb-2">Select Journey Date:</Text>
          <DatePicker
            value={journeyDate}
            onChange={(date) => setJourneyDate(date)}
            className="w-full border-gray-300"
          />
        </div>
      </Card>

      {/* Boarding Station Selection Card */}
      <Card bordered={false} className="p-5 shadow-lg rounded-lg bg-white">
        <Title level={4} className="mb-4 text-gray-700">Select Your Boarding Station</Title>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Choose a boarding station"
          optionFilterProp="children"
          onChange={handleStationChange}
          className="border-gray-300"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {stations.map((station) => (
            <Option key={station.code} value={station.code}>
              <span className="font-semibold text-gray-600">{station.code}</span> - 
              <span className="text-gray-500"> {station.name} </span> 
              <span className="text-grey-600">({station.time})</span>
            </Option>
          ))}
        </Select>
      </Card>
    </div>
  );
};

export default StationPage;

// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Card, Typography, Button } from 'antd';
// import dayjs from 'dayjs';

// const { Title, Text } = Typography;

// const StationPage = () => {
//   const router = useRouter();
//   const [journeyDate, setJourneyDate] = useState(dayjs('2024-10-15'));

//   const trainInfo = {
//     trainNumber: '12988',
//     boardingDate: '15/10/2024',
//     currentStation: 'Tundla Jn (TDL)',
//     delay: '4 min',
//   };

//   const stations = [
//     { code: 'AII', name: 'Ajmer Jn', time: '15/10/2024 | 12:52 PM' },
//     { code: 'JP', name: 'Jaipur', time: '15/10/2024 | 2:40 PM' },
//     { code: 'AF', name: 'Agra Fort', time: '15/10/2024 | 7:07 PM' },
//   ];

//   return (
//     <div className="bg-[#FAF3CC] min-h-screen">
//       {/* Header Section */}
//       <div className="text-center py-10 px-4">
//         <Title level={2} className="text-4xl font-bold text-[#6F4D27]">
//           Order <span className="text-[#D6872A]">Some Yummy</span> Food In Train
//         </Title>
//         <Card
//           bordered={false}
//           className="bg-[#6F4D27] text-[#FAF3CC] mt-6 p-6 rounded-lg max-w-lg mx-auto shadow-lg"
//         >
//           <div className="flex justify-center items-center mb-2">
//             <Text className="bg-[#D6872A] text-white py-1 px-4 rounded-full text-xl">
//               {trainInfo.trainNumber}
//             </Text>
//           </div>
//           <Text className="block text-lg font-semibold mb-1">
//             Boarding Date: {trainInfo.boardingDate}
//           </Text>
//           <Text className="block text-lg">
//             Current Station: {trainInfo.currentStation} / Delay By {trainInfo.delay}
//           </Text>
//           <Text className="block text-sm mt-4">
//             Note: If the train timings or date are showing incorrect, the team will correct them. Just place your order.
//           </Text>
//         </Card>
//       </div>

//       {/* Stations List */}
//       <div className="bg-white text-[#6F4D27] rounded-t-lg p-6 mt-4">
//         <div className="grid grid-cols-3 gap-4 text-center mb-4 font-semibold">
//           <div className="text-left">Station</div>
//           <div className="text-left">Arrival Date Time</div>
//           <div className="text-center">Action</div>
//         </div>

//         {stations.map((station) => (
//           <Card
//             key={station.code}
//             bordered={false}
//             className="mb-4 p-4 shadow-lg rounded-lg bg-[#FAF3CC]"
//           >
//             <div className="grid grid-cols-3 gap-4 items-center">
//               <div className="text-left text-lg font-semibold">{station.name}</div>
//               <div className="text-left text-lg">{station.time}</div>
//               <div className="flex justify-center">
//                 <Button
//                   type="primary"
//                   style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
//                   className="w-full sm:w-auto"
//                 >
//                   Select
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StationPage;



