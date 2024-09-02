"use client"

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
    <div className="max-w-[575px] mx-auto p-4">
      <Title level={2} className="text-center text-purple-700 mb-6">
        Order Food in CORBET PRK LINK (25014) Train
      </Title>
      
      <Card bordered={false} className="mb-6 p-4 shadow-lg rounded-lg">
        <Title level={4} className="mb-4">Journey Details</Title>
        <div className="mb-4">
          <Text className="block text-sm font-medium mb-2">Select Journey Date:</Text>
          <DatePicker 
            value={journeyDate}
            onChange={(date) => setJourneyDate(date)}
            className="w-full"
          />
        </div>
      </Card>

      <Card bordered={false} className="p-4 shadow-lg rounded-lg">
        <Title level={4} className="mb-4">Select Your Boarding Station</Title>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select a station"
          optionFilterProp="children"
          onChange={handleStationChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {stations.map((station) => (
            <Option key={station.code} value={station.code}>
              {station.code} - {station.name} ({station.time})
            </Option>
          ))}
        </Select>
      </Card>
    </div>
  );
};

export default StationPage;
