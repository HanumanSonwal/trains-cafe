"use client";
import { Input, Button, Tabs, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { createTrainSlug, createStationSlug } from "@/utils/slugify";

const { Option } = Select;

const OrderFood = () => {
  const [activeKey, setActiveKey] = useState("2");
  const [pnr, setPnr] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [station, setStation] = useState(undefined);
  const [stationOptions, setStationOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchStations("");
  }, []);

  const fetchStations = async (search) => {
    try {
      const query = search?.trim() ? `?search=${search}` : "?limit=10";
      const response = await fetch(`/api/station${query}`);
      const result = await response.json();

      if (response.ok) {
        const options = result.data.map((station) => ({
          value: station.code,
          label: `${station.name} (${station.code})`,
          name: station.name,
          slug: station.slug,
        }));
        setStationOptions(options);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  const searchPNR = async () => {
    if (!pnr) return message.error("Please enter a valid PNR number.");

    setLoading(true);
    try {
      const response = await fetch(`/api/rapid/pnr?query=${pnr}`);
      const result = await response.json();

      if (response.ok) {
        const slug = createTrainSlug(result.data.train_name, result.data.train_number);
        message.success("PNR found! Redirecting...");
        router.push(`/trains/${slug}`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const searchTrain = async () => {
    if (!trainNumber) return message.error("Please enter a valid train number.");

    setLoading(true);
    try {
      const formattedDate = dayjs().format("YYYY-MM-DD");
      const response = await fetch(`/api/rapid/live?trainNo=${trainNumber}&date=${formattedDate}`);
      const result = await response.json();

      if (response.ok) {
        const slug = createTrainSlug(result.data.train_name, result.data.train_number);
        message.success("Train found! Redirecting...");
        router.push(`/trains/${slug}`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const searchStation = async () => {
    if (!station) return message.error("Please select a station.");

    setLoading(true);
    try {
      const selectedStation = stationOptions.find((s) => s.value === station);

      console.log(selectedStation ,"selectedStation")

      if (!selectedStation) return message.error("Selected station not found.");
      const slug = selectedStation.slug || createStationSlug(selectedStation.name, selectedStation.value);
      message.success("Station found! Redirecting...");
      router.push(`/stations/${slug}`);
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "10 Digit PNR",
      onSearch: searchPNR,
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Input
            placeholder="Enter PNR No."
            className="flex-grow"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
          />
          <Button
            onClick={searchPNR}
            disabled={!pnr || loading}
            loading={loading}
            className="order-btn text-white border-none rounded-full px-4 py-2 text-xs font-[600]"
          >
            Order Now
          </Button>
        </div>
      ),
    },
    {
      key: "2",
      label: "Train No.",
      onSearch: searchTrain,
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Input
            placeholder="Enter Train No."
            className="flex-grow"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
          />
          <Button
            onClick={searchTrain}
            disabled={!trainNumber || loading}
            loading={loading}
            className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600]"
          >
            Order Now
          </Button>
        </div>
      ),
    },
    {
      key: "3",
      label: "Station Name",
      onSearch: searchStation,
      children: (
        <div className="flex items-center space-x-2 p-6">
          <Select
            showSearch
            placeholder="Enter Station Name"
            className="flex-grow"
            value={station}
            onFocus={() => fetchStations("")}
            onSearch={fetchStations}
            onChange={(value) => setStation(value)}
            options={stationOptions}
            filterOption={false}
          />
          <Button
            onClick={searchStation}
            disabled={!station || loading}
            loading={loading}
            className="order-btn border-none rounded-full px-4 py-2 text-xs font-[600]"
          >
            Order Now
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-2 mt-8">
      <div className="relative text-center mb-4">
        <img
          src="/images/Order.png"
          alt="Order Food Title Background"
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3"
        />
        <h2 className="text-[#704D25] text-2xl font-bold relative z-10">
          Order Your Food
        </h2>
      </div>
      <Tabs
        className="custom-tabs shadow-lg rounded-lg"
        activeKey={activeKey}
        onChange={setActiveKey}
        centered
        items={tabItems}
      />
    </div>
  );
};

export default OrderFood;

