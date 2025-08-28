/* eslint-disable @next/next/no-img-element */
"use client";

import { Input, Button, Tabs, Select, message } from "antd";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createTrainSlug, createStationSlug } from "@/utils/slugify";

const stationsCache = new Map();

const useDebounce = (fn, delay = 200) => {
  const timerRef = useRef(null);
  return useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
};

const timeoutFetch = async (url, opts = {}, ms = 5000) => {
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
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("3");
  const [station, setStation] = useState(undefined);
  const [stationOptions, setStationOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStations = useCallback(async (search = "") => {
    const q = (search || "").trim();
    const cacheKey = q === "" ? "__default__" : q.toLowerCase();
    if (stationsCache.has(cacheKey)) {
      setStationOptions(stationsCache.get(cacheKey));
      return;
    }
    try {
      const query = q ? `?search=${encodeURIComponent(q)}` : "?limit=10";
      const res = await timeoutFetch(`/api/station${query}`, {}, 5000);
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
      if (err.name !== "AbortError")
        message.error(err?.message || "Error fetching stations.");
    }
  }, []);

  const debouncedFetchStations = useDebounce(fetchStations, 150);

  useEffect(() => {
    fetchStations("");
  }, [fetchStations]);

  const renderInputTab = useCallback(
    (value, setValue, onSearch, maxLength) => (
      <div className="flex items-center space-x-2 p-6">
        <Input
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setValue(val.slice(0, maxLength));
          }}
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
    ),
    [loading]
  );

  const tabItems = useMemo(
    () => [
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
              onClick={async () => {
                if (!station) return message.error("Please select a station.");

                setLoading(true);

                const selected = stationOptions.find(
                  (s) => s.value === station
                );
                const slug =
                  selected?.slug ||
                  createStationSlug(selected?.name || "", station);

                await new Promise((resolve) => setTimeout(resolve, 100));

                router.push(`/stations/${slug}`);
                setLoading(false);
              }}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      station,
      stationOptions,
      loading,
      debouncedFetchStations,
      fetchStations,
    
      renderInputTab,
    ]
  );

  return (
    <div className="px-2 mt-8">
      <div className="relative text-center mb-4">
        <img
          src="/images/Order.png"
          alt="Order Food Title"
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
