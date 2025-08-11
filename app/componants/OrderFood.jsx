"use client";
import { Input, Button, Tabs, Select, message } from "antd";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { createTrainSlug, createStationSlug } from "@/utils/slugify";

const stationsCache = new Map();
const rapidCache = new Map();

const useDebounce = (fn, delay = 500) => {
  const tRef = useRef(null);
  return useCallback(
    (...args) => {
      if (tRef.current) clearTimeout(tRef.current);
      tRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
};

const timeoutFetch = async (url, opts = {}, ms = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export default function OrderFood() {
  const [activeKey, setActiveKey] = useState("2");
  const [pnr, setPnr] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [station, setStation] = useState(undefined);
  const [stationOptions, setStationOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchStations = useCallback(async (search = "") => {
    const q = (search || "").trim();
    const cacheKey = q === "" ? "__default__" : q.toLowerCase();
    try {
      if (stationsCache.has(cacheKey)) {
        setStationOptions(stationsCache.get(cacheKey));
        return;
      }
      const query = q ? `?search=${encodeURIComponent(q)}` : "?limit=10";
      const res = await timeoutFetch(`/api/station${query}`, {}, 7000);
      const result = await res.json();
      if (!res.ok)
        throw new Error(result?.message || "Failed to fetch stations.");
      const options = (result.data || []).map((s) => ({
        value: s.code,
        label: `${s.name} (${s.code})`,
        name: s.name,
        slug: s.slug,
      }));
      stationsCache.set(cacheKey, options);
      setStationOptions(options);
    } catch (err) {
      if (err.name !== "AbortError") {
        message.error(err?.message || "Error fetching stations.");
      }
    }
  }, []);

  const debouncedFetchStations = useDebounce(fetchStations, 450);

  useEffect(() => {
    fetchStations(""); 
  }, [fetchStations]);

  async function handleSearch(type) {
    try {
      setLoading(true);

      if (type === "pnr") {
        if (!pnr.trim()) {
          setLoading(false);
          return message.error("Please enter a valid PNR number.");
        }
        await searchTrainOrPNR(`/api/rapid/pnr?query=${pnr}`, pnr);

      } else if (type === "train") {
        if (!trainNumber.trim()) {
          setLoading(false);
          return message.error("Please enter a valid train number.");
        }
        const date = dayjs().format("YYYY-MM-DD");
        await searchTrainOrPNR(
          `/api/rapid/live?trainNo=${trainNumber}&date=${date}`,
          trainNumber
        );

      } else if (type === "station") {
        if (!station) {
          setLoading(false);
          return message.error("Please select a station.");
        }
        const selected = stationOptions.find((s) => s.value === station);
        if (!selected) {
          setLoading(false);
          return message.error("Selected station not found.");
        }

        const slug = selected.slug || createStationSlug(selected.name, selected.value);
        router.push(`/stations/${slug}`);

        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Something went wrong.");
      setLoading(false);
    }
  }

  async function searchTrainOrPNR(apiUrl, fallbackValue) {
    const cacheKey = apiUrl;
    if (rapidCache.has(cacheKey)) {
      const cached = rapidCache.get(cacheKey);
      return router.push(
        `/trains/${createTrainSlug(
          cached.train_name || cached.train_number,
          cached.train_number
        )}`
      );
    }
    let didOptimistic = false;
    const optimisticTimer = setTimeout(() => {
      didOptimistic = true;
      router.push(`/trains/${createTrainSlug(fallbackValue, fallbackValue)}`);
    }, 700);

    const res = await timeoutFetch(apiUrl, {}, 8000);
    clearTimeout(optimisticTimer);
    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Lookup failed.");
    rapidCache.set(cacheKey, result.data);

    const slug = createTrainSlug(
      result.data.train_name || result.data.train_number,
      result.data.train_number
    );
    if (!didOptimistic) router.push(`/trains/${slug}`);
    else message.success("Details found! Redirecting...");
  }

  const tabItems = useMemo(
    () => [
      {
        key: "1",
        label: "10 Digit PNR",
        children: renderInputTab(pnr, setPnr, () => handleSearch("pnr"), loading),
      },
      {
        key: "2",
        label: "Train No.",
        children: renderInputTab(trainNumber, setTrainNumber, () => handleSearch("train"), loading),
      },
      {
        key: "3",
        label: "Station Name",
        children: (
          <div className="flex items-center space-x-2 p-6">
            <Select
              showSearch
              placeholder="Enter Station Name"
              className="flex-grow"
              value={station}
              onSearch={debouncedFetchStations}
              onFocus={() => {
                if (!stationsCache.has("__default__")) fetchStations("");
              }}
              onChange={(val) => setStation(val)}
              options={stationOptions}
              filterOption={false}
              disabled={loading}
            />
            <Button
              onClick={() => handleSearch("station")}
              disabled={!station || loading}
              loading={loading}
              className="order-btn rounded-full px-4 py-2 text-xs font-[600]"
            >
              Order Now
            </Button>
          </div>
        ),
      },
    ],
    [pnr, trainNumber, station, stationOptions, loading, debouncedFetchStations, fetchStations]
  );

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
}

function renderInputTab(value, setValue, onSearch, loading) {
  return (
    <div className="flex items-center space-x-2 p-6">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
        className="flex-grow"
        disabled={loading}
      />
      <Button
        onClick={onSearch}
        disabled={!value || loading}
        loading={loading}
        className="order-btn rounded-full px-4 py-2 text-xs font-[600]"
      >
        Order Now
      </Button>
    </div>
  );
}
