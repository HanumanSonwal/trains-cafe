"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { useLiveTrain } from "@/app/hooks/useLiveTrain";
import { useKitchens } from "@/app/hooks/useKitchens";
import JourneyStatus from "./JourneyStatus";
import RouteTimeline from "./RouteTimeline";
import StopSection from "./StopSection";
import { kitchenLabel, runDateLabel } from "./journeyUtils";

const COLLAPSED_ROWS = 8; // long "all stops" lists start short

const phone = process.env.NEXT_PUBLIC_PHONE;
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

function Skeleton() {
  const bar = "animate-pulse rounded-xl bg-gray-200/70";
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading live train status">
      <div className={`${bar} h-[118px]`} />
      <div className={`${bar} h-[260px]`} />
      <div className={`${bar} h-[64px]`} />
      <div className={`${bar} h-[64px]`} />
    </div>
  );
}

function Notice({ tone = "info", title, children }) {
  const tones = {
    info: "border-gray-200 bg-white",
    bad: "border-red-200 bg-red-50",
  };
  return (
    <div className={`rounded-2xl border px-4 py-5 text-center ${tones[tone]}`}>
      <p className="text-[15px] font-semibold text-gray-900">{title}</p>
      {children && <div className="mt-1 text-sm text-gray-600">{children}</div>}
    </div>
  );
}

function ContactButtons() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
      <a href={`tel:${phone}`} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#704D25] px-4 text-sm font-semibold text-white hover:bg-[#5a3d1d]">
        <PhoneOutlined /> Order via Call
      </a>
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
      >
        <WhatsAppOutlined className="text-green-600" /> WhatsApp
      </a>
    </div>
  );
}

/**
 * Live journey for one train: where it is, the stops still ahead, and the
 * kitchens at those stops. Stops the train has already left are never offered.
 */
export default function JourneyView({ trainNo, trainName, date }) {
  const router = useRouter();
  const live = useLiveTrain(trainNo, date);
  const { kitchens, failed } = useKitchens();

  const [filter, setFilter] = useState(null); // null = automatic
  const [showAll, setShowAll] = useState(false);
  const [openCode, setOpenCode] = useState(null); // null = first kitchen stop, "" = none
  const [scrollTo, setScrollTo] = useState("");

  const data = live.data;
  const name = data?.train_name || trainName || "Train";

  // Upcoming halts, tagged with how many kitchens each has.
  const stops = useMemo(
    () =>
      (data?.upcoming_stations ?? []).map((s, i) => ({
        ...s,
        isNext: i === 0,
        kitchens: kitchens?.[String(s.station_code).toUpperCase()] ?? 0,
      })),
    [data, kitchens]
  );
  const kitchenStops = useMemo(() => stops.filter((s) => s.kitchens > 0 && !s.at_station), [stops]);

  const view = filter ?? (kitchenStops.length > 0 ? "kitchens" : "all");
  const listed = view === "kitchens" ? stops.filter((s) => s.kitchens > 0) : stops;
  const visible = view === "all" && !showAll ? listed.slice(0, COLLAPSED_ROWS) : listed;
  const hidden = listed.length - visible.length;

  const open = openCode ?? kitchenStops[0]?.station_code ?? "";
  const train = useMemo(
    () => ({ trainNo, trainName: name, train_number: trainNo, train_name: name }),
    [trainNo, name]
  );

  // Scroll to a section once it has rendered open.
  useEffect(() => {
    if (!scrollTo) return;
    document.getElementById(`stop-${scrollTo}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setScrollTo("");
  }, [scrollTo]);

  const pick = (code) => {
    setOpenCode(code);
    setScrollTo(code);
  };
  const goBack = () => (window.history.length > 1 ? router.back() : router.push("/"));

  const subtitle = data
    ? [trainNo, runDateLabel(data.run_date), data.source?.name && data.destination?.name ? `${data.source.name} → ${data.destination.name}` : ""]
        .filter(Boolean)
        .join(" · ")
    : trainNo;

  return (
    <div className="mx-auto w-full max-w-xl pb-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeftOutlined />
        </button>
        <div className="min-w-0">
          {/* the site forces h1-h4 sizes with !important, so the size needs ! too */}
          <h1 className="truncate !text-[18px] font-semibold leading-tight text-gray-900">
            <span className="sr-only">Order Food in </span>
            {name}
            <span className="sr-only"> ({trainNo}) Train</span>
          </h1>
          <p className="truncate text-[12.5px] text-gray-500">{subtitle}</p>
        </div>
      </header>

      <div className="mt-4 space-y-3">
        {live.loading && <Skeleton />}

        {!live.loading && !data && (
          <Notice tone="bad" title="We couldn't load this train">
            {live.error || "Please check the train number and try again."}
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" onClick={live.refresh} className="min-h-[40px] rounded-full bg-[#704D25] px-5 text-sm font-semibold text-white hover:bg-[#5a3d1d]">
                Try again
              </button>
              <button type="button" onClick={() => router.push("/")} className="min-h-[40px] rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                Home
              </button>
            </div>
          </Notice>
        )}

        {data && (
          <>
            <JourneyStatus data={data} next={stops[0]} refreshing={live.refreshing} onRefresh={live.refresh} fetchedAt={live.fetchedAt} />

            {live.error && (
              <p role="status" className="rounded-xl bg-amber-50 px-3 py-2 text-center text-xs text-amber-800">
                Couldn't refresh just now. Showing the last update.
              </p>
            )}

            {data.status === "cancelled" ? (
              <Notice tone="bad" title="This train is cancelled for this date">
                Please check the train on another day, or order by call or WhatsApp.
                <ContactButtons />
              </Notice>
            ) : stops.length === 0 ? (
              <Notice title="No stops left on this run">
                {data.new_message || "This train has completed its journey."}
              </Notice>
            ) : (
              <>
                <section aria-labelledby="route-h" className="rounded-2xl border border-gray-200 bg-white pt-3 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4">
                    <p id="route-h" role="heading" aria-level={2} className="text-sm font-semibold text-gray-900">
                      Your route
                    </p>
                    {kitchenStops.length > 0 && (
                      <div role="group" aria-label="Which stops to show" className="inline-flex rounded-full bg-gray-100 p-0.5 text-xs font-semibold">
                        {[
                          ["kitchens", `Kitchen stops (${kitchenStops.length})`],
                          ["all", `All stops (${stops.length})`],
                        ].map(([key, label]) => (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={view === key}
                            onClick={() => {
                              setFilter(key);
                              setShowAll(false);
                            }}
                            className={`min-h-[30px] rounded-full px-3 transition ${view === key ? "bg-white text-[#704D25] shadow-sm" : "text-gray-500"}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-1">
                    <RouteTimeline left={data.left_station} stops={visible} onPick={pick} />
                  </div>

                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className="w-full border-t border-gray-100 py-3 text-sm font-semibold text-[#704D25] hover:bg-[#faf3ea]"
                    >
                      Show {hidden} more {hidden === 1 ? "stop" : "stops"}
                    </button>
                  )}
                </section>

                {kitchens === null ? (
                  <p className="px-1 text-center text-xs text-gray-500">Checking kitchens on your route…</p>
                ) : kitchenStops.length === 0 ? (
                  <Notice title={failed ? "Couldn't check kitchens right now" : "No Trainscafe kitchen ahead on this route yet"}>
                    {failed ? "Please try again in a moment, or order by call or WhatsApp." : "New kitchens join every week. You can still order by call or WhatsApp."}
                    <ContactButtons />
                  </Notice>
                ) : (
                  <>
                    <p role="heading" aria-level={2} className="px-1 pt-2 text-xs font-semibold uppercase leading-snug tracking-wide text-gray-500">
                      Order at stops ahead · {kitchenLabel(kitchenStops.reduce((n, s) => n + s.kitchens, 0))}
                    </p>
                    {kitchenStops.map((stop) => (
                      <StopSection
                        key={stop.station_code}
                        stop={stop}
                        train={train}
                        open={open === stop.station_code}
                        onToggle={() => setOpenCode(open === stop.station_code ? "" : stop.station_code)}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
