"use client";

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addStationDetails, addVendorDetails } from "@/app/redux/cartSlice";
import { trackSelectVendor } from "@/app/lib/analytics";
import KitchenList from "@/app/componants/kitchens/KitchenList";

// Kitchens at a station (station pages, no train chosen yet).
function VendorCardWithoutTrain({ selectedStation }) {
  const dispatch = useDispatch();

  const handleSelect = useCallback(
    (vendor) => {
      trackSelectVendor(vendor, selectedStation);
      dispatch(addStationDetails({ ...selectedStation }));
      dispatch(addVendorDetails({ ...vendor }));
    },
    [dispatch, selectedStation]
  );

  if (!selectedStation?.code) return null;
  return (
    <KitchenList
      stationCode={selectedStation.code}
      stationName={selectedStation.name}
      onSelect={handleSelect}
      place="station_page"
    />
  );
}

export default React.memo(VendorCardWithoutTrain);
