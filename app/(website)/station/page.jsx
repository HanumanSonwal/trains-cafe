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
    router.push(`/menu?station=${value}&date=${journeyDate.format('YYYY-MM-DD')}`);
  };

  return (
    <div className="max-w-[575px] mx-auto p-6 bg-gray-50">
      <Title level={2} className="text-center text-indigo-600 font-bold mb-8">
     
      </Title>
      <h2 className="text-[#704D25] mx-auto text-center p-6  text-2xl font-bold relative z-10">
      Order Food in  <br/><span className="text-[#d6872a] text-xl">CORBET PRK LINK (25014)</span>
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
