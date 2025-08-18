import { Card, Rate, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
  ClockCircleOutlined,
  LoadingOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  addStationDetails,
  addTrainDetails,
  addVendorDetails,
} from "@/app/redux/cartSlice";
import { useDispatch } from "react-redux";

function VendorCard({ station, train }) {
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(
          `/api/vendors?stationcode=${station.station_code}`
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setVendors(data.data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [station.station_name]);

  const handleRedirect = (vendor) => {
    dispatch(addStationDetails({ ...station }));
    dispatch(addVendorDetails({ ...vendor }));
    dispatch(addTrainDetails({ ...train }));
    router.push(`/menu?vendor=${vendor._id}`);
  };

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 48, color: "#D6872A" }} spin />
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin indicator={antIcon} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-lg font-semibold text-red-600 mb-2">
          No vendors found for {station.station_name}.
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
    );
  }
  return (
    <div>
      {vendors.map((vendor, index) => (
        <Card
          className="shadow-md mb-4 p-4"
          key={index}
          style={{ margin: "10px 0" }}
        >
          <div className="flex flex-col md:flex-row items-start">
            <Image
              width={120}
              height={120}
              src="/images/special-veg-thali.jpg"
              alt="Food"
              className="w-24 h-24 object-cover mb-4 md:mb-0 md:mr-4 rounded-lg"
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold">{`Outlet_${index + 1}`}</h2>
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
              <div className="flex flex-wrap items-center mt-1">
                {vendor.Food_Type === "Veg" && (
                  <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded mr-2">
                    V
                  </span>
                )}
                {vendor.Food_Type === "Non-Veg" && (
                  <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-2">
                    N
                  </span>
                )}
                {vendor.Food_Type === "Veg & Non-Veg" && (
                  <>
                    <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded mr-2">
                      V
                    </span>
                    <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-2">
                      N
                    </span>
                  </>
                )}
                <span className="text-sm">
                  Min Order ₹ {vendor.Min_Order_Value}
                </span>
                <ClockCircleOutlined className="ml-2 mr-1" />
                <span className="text-sm text-red-500">
                  {vendor.Min_Order_Time} MIN
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center">
                <span className="text-xs font-semibold px-2 py-1 border border-red-400 rounded-full text-red-500 mr-2 mb-2 md:mb-0">
                  Flat 5% Off on all online orders
                </span>
                <button
                  className="ml-auto px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                  onClick={() => handleRedirect(vendor)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default VendorCard;
