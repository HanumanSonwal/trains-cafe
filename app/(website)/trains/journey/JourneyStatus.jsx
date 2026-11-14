"use client";

import { ReloadOutlined } from "@ant-design/icons";
import { TONE_TEXT, clockIST, dayTag, isLate, statusInfo, to12h } from "./journeyUtils";

function TrainGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="3" width="14" height="14" rx="3" />
      <path d="M5 11h14M9 21l2-4M15 21l-2-4" />
      <circle cx="9" cy="14" r=".6" fill="currentColor" />
      <circle cx="15" cy="14" r=".6" fill="currentColor" />
    </svg>
  );
}

function Place({ label, name, time, tag, late, align = "left" }) {
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="truncate text-sm font-semibold leading-snug text-gray-900">{name}</p>
      {time && (
        <p className="text-xs tabular-nums text-gray-500">
          {time}
          {tag && <span className="ml-1">· {tag}</span>}
          {late > 0 && <span className="ml-1 font-medium text-amber-700">+{late}m</span>}
        </p>
      )}
    </div>
  );
}

/** Where the train is, at a glance: status, the station it last left and the next stop. */
export default function JourneyStatus({ data, next, refreshing, onRefresh, fetchedAt }) {
  const { tone, text, live } = statusInfo(data);
  const updated = clockIST(data.last_updated) || clockIST(fetchedAt);
  const cancelled = data.status === "cancelled";

  const leftName = data.left_station?.name || data.source?.name || "";
  const leftLabel = data.left_station ? "Left" : "Boards at";

  return (
    <section aria-label="Train status" className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5">
        <p className={`flex items-center gap-2 text-sm font-semibold ${TONE_TEXT[tone]}`}>
          <span className="relative flex h-2 w-2" aria-hidden="true">
            {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full bg-current ${live ? "" : "opacity-60"}`} />
          </span>
          {text}
        </p>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh live status"
          className="flex min-h-[32px] items-center gap-1.5 rounded-full px-2 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-60"
        >
          {updated ? `Updated ${updated}` : "Refresh"}
          <ReloadOutlined spin={refreshing} className="text-[13px]" />
        </button>
      </div>

      {!cancelled && (leftName || next) && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pb-4 pt-3">
          <Place label={leftLabel} name={leftName || "—"} />
          <span className="flex items-center gap-1 text-[#D6872A]" aria-hidden="true">
            <span className="h-[3px] w-4 rounded-full bg-[#D6872A]/70" />
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#faf3ea]">
              <TrainGlyph />
            </span>
            <span className="h-0 w-4 border-t-2 border-dashed border-gray-300" />
          </span>
          {next ? (
            <Place
              label={next.at_station ? "At station" : data.status === "not-started" ? "Departs" : "Next stop"}
              name={next.station_name}
              time={to12h(next.eta)}
              tag={dayTag(next.eta_date)}
              late={isLate(next.delay_minutes) ? next.delay_minutes : 0}
              align="right"
            />
          ) : (
            <Place label="Journey" name="Complete" align="right" />
          )}
        </div>
      )}
    </section>
  );
}
