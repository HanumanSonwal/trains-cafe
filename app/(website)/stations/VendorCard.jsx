"use client";
import { Card, Rate, Skeleton, Spin } from "antd";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  ClockCircleOutlined,
  LoadingOutlined,
  PhoneTwoTone,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addStationDetails, addVendorDetails } from "@/app/redux/cartSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

function VendorCardWithoutTrain({ selectedStation }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [redirectingId, setRedirectingId] = useState(null);

    const phone = process.env.NEXT_PUBLIC_PHONE;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

  const handleRedirect = useCallback(
    (vendor) => {
      setRedirectingId(vendor._id);
      dispatch(addStationDetails({ ...selectedStation }));
      dispatch(addVendorDetails({ ...vendor }));

      router.push(`/menu?vendor=${vendor._id}`);
    },
    [dispatch, selectedStation, router]
  );

  useEffect(() => {
    if (!selectedStation?.code) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(
          `/api/vendors?stationcode=${selectedStation.code}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await res.json();
        if (!isMounted) return;

        if (data?.data?.length > 0) {
          setVendors(data.data);

          data.data.forEach((vendor) => {
            router.prefetch(`/menu?vendor=${vendor._id}`);
          });
        } else {
          setError(true);
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          setError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVendors();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedStation?.code, router]);

  const vendorCards = useMemo(
    () =>
      vendors.map((vendor, index) => (
        <Card className="shadow-md p-4 rounded-lg" key={vendor._id || index}>
          <div className="flex flex-col md:flex-row items-start">
            <Image
              width={120}
              height={120}
              src="/images/special-veg-thali.jpg"
              alt="Food"
              priority={index < 2}
              placeholder="blur"
              blurDataURL="/images/blur-placeholder.png"
              className="w-24 h-24 object-cover mb-4 md:mb-0 md:mr-4 rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {vendor.name || `Outlet_${index + 1}`}
              </h2>
              <div className="flex items-center mt-1">
                <Rate
                  allowHalf
                  defaultValue={4.5}
                  style={{ fontSize: 16, color: "#FFB400" }}
                />
                <span className="text-xs text-gray-500 ml-2">
                  (790 Reviews)
                </span>
              </div>
              <p className="text-sm mt-1">
                Serving From{" "}
                <span className="font-semibold text-green-600">
                  {vendor.Working_Time}
                </span>
              </p>
              <div className="flex flex-wrap items-center mt-1 gap-2">
                {vendor.Food_Type?.includes("Veg") && (
                  <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                    V
                  </span>
                )}
                {vendor.Food_Type?.includes("Non-Veg") && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                    N
                  </span>
                )}
                <span className="text-sm">
                  Min Order ₹ {vendor.Min_Order_Value}
                </span>
                <ClockCircleOutlined className="ml-2 mr-1" />
                <span className="text-sm text-red-500">
                  {vendor.Min_Order_Time} MIN
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center">
                <span className="text-xs font-semibold px-2 py-1 border border-red-400 rounded-full text-red-500 mr-2">
                  Flat 5% Off on all online orders
                </span>
                <button
                  className="p-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition flex items-center justify-center min-w-[80px]"
                  onClick={() => handleRedirect(vendor)}
                  disabled={redirectingId === vendor._id}
                >
                  {redirectingId === vendor._id ? (
                    <LoadingOutlined
                      style={{ fontSize: 18, color: "white" }}
                      spin
                    />
                  ) : (
                    "Order Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Card>
      )),
    [vendors, handleRedirect, redirectingId]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 36, color: "#d6872a" }} spin />
          }
        />
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center text-center p-4">
      <p className="text-lg font-semibold text-red-600 mb-2">
        No vendors found for this station.
      </p>
      <p className="text-md text-gray-700 mb-4">
        Please order food by calling or via WhatsApp.
      </p>
      <div className="flex items-center space-x-4">
        {/* Call Link */}
        <Link href={`tel:${phone}`} className="flex items-center space-x-1">
          <PhoneTwoTone className="text-blue-500 text-2xl" />
          <span className="text-blue-500">Call Us</span>
        </Link>

        {/* WhatsApp Link */}
        <Link
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1"
        >
          <WhatsAppOutlined className="text-green-500 text-2xl" />
          <span className="text-green-500">WhatsApp Us</span>
        </Link>
      </div>
    </div>
    );
  }

  return <div className="grid grid-cols-1 gap-6 py-4">{vendorCards}</div>;
}

export default React.memo(VendorCardWithoutTrain);
