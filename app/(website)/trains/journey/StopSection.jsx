"use client";

import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import VendorCard from "../VendorCard";
import { dayTag, isLate, kitchenLabel, to12h } from "./journeyUtils";

/**
 * One station ahead that has kitchens. Collapsed by default (only the first
 * is open) and the vendor list is only fetched once a section is opened, so a
 * long route never fires a burst of vendor requests.
 */
export default function StopSection({ stop, train, open, onToggle }) {
  const [opened, setOpened] = useState(open);
  useEffect(() => {
    if (open) setOpened(true); // keep it mounted after closing: no refetch on reopen
  }, [open]);

  const id = `stop-${stop.station_code}`;
  const late = isLate(stop.delay_minutes);

  // What checkout / place-order read from the cart: they use name + code (and
  // station_* / eta for the existing pages), so send both spellings.
  const cartStation = {
    station_name: stop.station_name,
    station_code: stop.station_code,
    eta: stop.eta,
    eta_date: stop.eta_date, // lets the order carry the real delivery day
    name: stop.station_name,
    code: stop.station_code,
  };

  return (
    <section id={id} className="scroll-mt-20 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold leading-snug text-gray-900">
            {stop.station_name} <span className="text-xs font-normal text-gray-400">{stop.station_code}</span>
          </span>
          <span className="mt-0.5 block text-xs text-gray-500">
            Arrives <b className="font-semibold text-gray-800">{to12h(stop.eta)}</b>
            {dayTag(stop.eta_date) && <span> · {dayTag(stop.eta_date)}</span>}
            {late && <span className="font-medium text-amber-700"> +{stop.delay_minutes} min</span>}
            {stop.halt_minutes > 0 && <span> · {stop.halt_minutes} min halt</span>}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[#faf3ea] px-2.5 py-1 text-xs font-semibold text-[#B8651B]">
            {kitchenLabel(stop.kitchens)}
          </span>
          <DownOutlined className={`text-xs text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </span>
      </button>

      <div id={`${id}-body`} hidden={!open} className="border-t border-gray-100 px-3 pb-3">
        {opened && <VendorCard station={cartStation} train={train} activeOnly />}
      </div>
    </section>
  );
}
