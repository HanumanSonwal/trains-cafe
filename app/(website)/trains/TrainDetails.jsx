"use client";

import { useSearchParams } from "next/navigation";
import RecentOrders from "@/app/componants/RecentOrders";
import TrainContent from "./TrainContent";
import JourneyView from "./journey/JourneyView";
import { parseTrainSlug } from "@/utils/parseTrainSlug";

export default function TrainDetails({ params }) {
  const { slug } = params;
  const { trainNo, trainName } = parseTrainSlug(slug);

  // A PNR search passes the journey date as ?date=YYYY-MM-DD. Without it RailRadar
  // returns the run that is on the road right now (right for overnight trains).
  const dateParam = useSearchParams().get("date");
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateParam || "") ? dateParam : "";

  return (
    <div className="mx-auto max-w-3xl p-4 pb-24">
      <JourneyView trainNo={trainNo} trainName={trainName} date={date} />
      <RecentOrders />
      <TrainContent slug={slug} trainNo={trainNo} />
    </div>
  );
}
