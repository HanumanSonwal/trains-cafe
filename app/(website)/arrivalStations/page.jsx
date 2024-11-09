"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { message, Collapse } from "antd";
import VendorCard from "./VendorCard";
import RecentOrders from "@/app/componants/RecentOrders";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const ArrivalStations = () => {
  const searchParams = useSearchParams();
  const trainNo = searchParams.get("trainNo");
  const trainName = searchParams.get("trainName");
  const journeyDate = searchParams.get("date");
  const [upcomingStations, setUpcomingStations] = useState([]); 
  const [activeKey, setActiveKey] = useState(null);
  const [newMessage, setNewMessage] = useState("");

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
        console.log(result.data.new_message, "result");

        if (response.ok && result.data.success) {
          setUpcomingStations(result.data.upcoming_stations);
          setNewMessage(result.data.new_message || ""); 
          console.log(result.data.upcoming_stations);
        } else {
          throw new Error(result.message || "Failed to fetch station data.");
        }
      } catch (error) {
        message.error(`Error: ${error.message}`);
      }
    };

    if (trainNo) {
      fetchUpcomingStations();
    }
  }, [trainNo, journeyDate]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4" style={{ color: "#704d25" }}>
        Order Food in {trainName} ({trainNo}) Train
      </h1>

      <div className="bg-gray-100 p-2 mb-4">
        <span className="font-semibold" style={{ color: "#704d25" }}>Journey Date:</span> {journeyDate}
      </div>


      { !upcomingStations && newMessage && (
        <div className="flex flex-col items-center text-center p-4">
          <p className="text-lg font-semibold text-red-600 mb-2">
            {newMessage}
          </p>
          <p className="text-md text-gray-700 mb-4">
            Please order food by calling or via WhatsApp.
          </p>
          <div className="flex items-center space-x-4">
            <a href="tel:+1234567890" className="flex items-center space-x-1">
              <PhoneOutlined className="text-blue-500 text-2xl" />
              <span className="text-blue-500">Call Us</span>
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <WhatsAppOutlined className="text-green-500 text-2xl" />
              <span className="text-green-500">WhatsApp Us</span>
            </a>
          </div>
        </div>
      )}

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

      <RecentOrders />
    </div>
  );
};

export default ArrivalStations;
