// import { Card, Rate, Input } from "antd";
// import React, { useEffect, useState } from "react";
// import { ClockCircleOutlined } from "@ant-design/icons";
// import { usePathname, useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   addStationDetails,
//   addTrainDetails,
//   addVendorDetails,
// } from "@/app/redux/cartSlice";
// import { useDispatch } from "react-redux";

// function VendorCard({ station, train }) {
//   const router = useRouter();
//   const [vendors, setVendors] = useState([]);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const response = await fetch(
//           `/api/vendors?search=${station.station_name}`
//         );
//         const data = await response.json();
//         setVendors(data.data || []);
//       } catch (error) {
//         console.error("Error fetching vendor data:", error);
//       }
//     };

//     fetchVendors();
//   }, [station.station_name]);

//   const handleRedirect = (vendor) => {
//     dispatch(addStationDetails({ ...station }));
//     dispatch(addVendorDetails({ ...vendor }));
//     dispatch(addTrainDetails({ ...train }));

//     router.push(`/menu?vendor=${vendor._id}`);
//   };

//   return (
//     <div>
//       {vendors.map((vendor, index) => (
//         <Card
//           className="shadow-md mb-4"
//           key={index}
//           style={{ margin: "10px 0" }}
//         >
//           <div className="flex items-start">
//             <Image
//               width={100}
//               height={100}
//               src="/images/special-veg-thali.jpg"
//               alt="Food"
//               className="w-24 h-24 object-cover mr-4"
//             />
//             <div>
//               <h2 className="text-lg font-semibold">{vendor.Vendor_Name}</h2>
//               {/* <Rate allowHalf defaultValue={vendor.rating} className="text-sm" /> */}
//               {/* <span className="text-gray-500 text-sm ml-2">{vendor.reviews}+ reviews</span> */}
//               <p className="text-sm mt-1">
//                 Serving From{" "}
//                 <span className="font-semibold">{vendor.servingTime}</span>
//               </p>
//               <div className="flex items-center mt-1">
//                 <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded mr-2">
//                   V
//                 </span>
//                 <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-2">
//                   N
//                 </span>
//                 <span className="text-sm">
//                   Min Order ₹ {vendor.Min_Order_Value}
//                 </span>
//                 <ClockCircleOutlined className="ml-2 mr-1" />
//                 <span className="text-sm">{vendor.Min_Order_Time} MIN</span>
//               </div>
//             </div>
//           </div>
//           <button
//             className="mt-4 px-4 py-2 rounded foot-menu-btn transition duration-300"
//             onClick={() => handleRedirect(vendor)}
//           >
//             Food Menu
//           </button>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default VendorCard;


import { Card, Rate, Input, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { ClockCircleOutlined, LoadingOutlined } from "@ant-design/icons";
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
          `/api/vendors?search=${station.station_name}`
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

  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: "#D6872A" }} spin />;

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin indicator={antIcon} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <p>No vendors found for {station.station_name}.</p>
      </div>
    );
  }

  return (
    <div>
      {vendors.map((vendor, index) => (
        <Card
          className="shadow-md mb-4"
          key={index}
          style={{ margin: "10px 0" }}
        >
          <div className="flex items-start">
            <Image
              width={100}
              height={100}
              src="/images/special-veg-thali.jpg"
              alt="Food"
              className="w-24 h-24 object-cover mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">{vendor.Vendor_Name}</h2>
              <p className="text-sm mt-1">
                Serving From{" "}
                <span className="font-semibold">{vendor.servingTime}</span>
              </p>
              <div className="flex items-center mt-1">
                <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded mr-2">
                  V
                </span>
                <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded mr-2">
                  N
                </span>
                <span className="text-sm">
                  Min Order ₹ {vendor.Min_Order_Value}
                </span>
                <ClockCircleOutlined className="ml-2 mr-1" />
                <span className="text-sm">{vendor.Min_Order_Time} MIN</span>
              </div>
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 rounded foot-menu-btn transition duration-300"
            onClick={() => handleRedirect(vendor)}
          >
            Food Menu
          </button>
        </Card>
      ))}
    </div>
  );
}

export default VendorCard;

