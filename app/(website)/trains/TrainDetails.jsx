"use client";

import { useSearchParams } from "next/navigation";
import RecentOrders from "@/app/componants/RecentOrders";
import JourneyView from "./journey/JourneyView";
import { parseTrainSlug } from "@/utils/parseTrainSlug";

// The live part of a train page (needs ?date= from the URL, so it renders in the browser).
export default function TrainDetails({ params }) {
  const { trainNo, trainName } = parseTrainSlug(params.slug);

  // A PNR search passes the journey date as ?date=YYYY-MM-DD. Without it RailRadar
  // returns the run that is on the road right now (right for overnight trains).
  const dateParam = useSearchParams().get("date");
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateParam || "") ? dateParam : "";

  return (
    <>
      <JourneyView trainNo={trainNo} trainName={trainName} date={date} />
      <RecentOrders />
    </>
  );
}
