"use client";

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addStationDetails, addTrainDetails, addVendorDetails } from "@/app/redux/cartSlice";
import { trackSelectVendor } from "@/app/lib/analytics";
import KitchenList from "@/app/componants/kitchens/KitchenList";

// Kitchens at one stop of a train's journey. Only active kitchens are listed.
function VendorCard({ station, train }) {
  const dispatch = useDispatch();

  const handleSelect = useCallback(
    (vendor) => {
      trackSelectVendor(vendor, station, train);
      dispatch(addStationDetails({ ...station }));
      dispatch(addVendorDetails({ ...vendor }));
      dispatch(addTrainDetails({ ...train }));
    },
    [dispatch, station, train]
  );

  return (
    <KitchenList
      stationCode={station.station_code}
      stationName={station.station_name}
      onSelect={handleSelect}
      place="train_journey"
    />
  );
}

export default React.memo(VendorCard);
