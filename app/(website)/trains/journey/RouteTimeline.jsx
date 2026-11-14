"use client";

import { RightOutlined } from "@ant-design/icons";
import { dayTag, isLate, kitchenLabel, to12h } from "./journeyUtils";

const NODE = {
  left: "h-3 w-3 bg-orange-200",
  next: "h-4 w-4 bg-[#D6872A] ring-4 ring-orange-100",
  kitchen: "h-3.5 w-3.5 border-2 border-[#D6872A] bg-white",
  plain: "h-3 w-3 border-2 border-gray-300 bg-white",
};

/** One line of the route: time | rail with a dot | station. */
function Row({ state, first, last, time, tag, late, name, sub, subTone, onClick }) {
  const Tag = onClick ? "button" : "div";
  const dim = state === "left" || state === "plain";
  return (
    <li>
      <Tag
        {...(onClick ? { type: "button", onClick } : {})}
        className={`grid w-full grid-cols-[72px_24px_1fr] gap-x-2 px-4 text-left ${
          onClick ? "cursor-pointer rounded-lg transition hover:bg-[#faf3ea] active:bg-[#faf3ea]" : ""
        }`}
      >
        <span className="pt-2.5 text-right">
          <span className={`block text-[13px] font-semibold leading-5 tabular-nums ${dim ? "text-gray-400" : "text-gray-900"}`}>
            {time}
          </span>
          {(tag || late > 0) && (
            <span className="block text-[11px] leading-4 text-amber-700">
              {tag}
              {tag && late > 0 ? " · " : ""}
              {late > 0 ? `+${late} min` : ""}
            </span>
          )}
        </span>

        <span className="relative" aria-hidden="true">
          {!first && <span className="absolute left-1/2 top-0 h-5 -translate-x-1/2 border-l border-dashed border-gray-300" />}
          {!last && <span className="absolute bottom-0 left-1/2 top-5 -translate-x-1/2 border-l border-dashed border-gray-300" />}
          <span className={`absolute left-1/2 top-5 -translate-x-1/2 -translate-y-1/2 rounded-full ${NODE[state]}`} />
        </span>

        <span className="flex min-w-0 items-start justify-between gap-2 py-2.5 pb-3">
          <span className="min-w-0">
            <span className={`block truncate text-sm leading-5 ${state === "kitchen" || state === "next" ? "font-semibold text-gray-900" : dim ? "text-gray-500" : "text-gray-800"}`}>
              {name}
            </span>
            {sub && <span className={`block text-xs leading-4 ${subTone || "text-gray-400"}`}>{sub}</span>}
          </span>
          {onClick && <RightOutlined className="mt-1 shrink-0 text-[11px] text-gray-400" aria-hidden="true" />}
        </span>
      </Tag>
    </li>
  );
}

/**
 * The remaining route. Stops with a Trainscafe kitchen are highlighted and tappable;
 * the one station the train has just left is shown dimmed for context.
 */
export default function RouteTimeline({ left, stops, onPick }) {
  const rows = [];
  if (left) rows.push({ key: "left", state: "left", time: to12h(left.time), name: left.name, sub: "Train has left" });

  stops.forEach((s, i) => {
    const hasKitchen = s.kitchens > 0 && !s.at_station;
    const isNext = i === 0 && s.isNext;
    rows.push({
      key: s.station_code,
      state: isNext ? "next" : hasKitchen ? "kitchen" : "plain",
      time: to12h(s.eta),
      tag: dayTag(s.eta_date),
      late: isLate(s.delay_minutes) ? s.delay_minutes : 0,
      name: s.station_name,
      sub: s.at_station
        ? "Train is here now"
        : hasKitchen
          ? kitchenLabel(s.kitchens)
          : s.isNext
            ? "Next stop"
            : "",
      subTone: s.at_station ? "text-green-600 font-medium" : hasKitchen ? "text-[#B8651B] font-semibold" : "text-gray-400",
      onClick: hasKitchen ? () => onPick(s.station_code) : undefined,
    });
  });

  return (
    <ol className="py-1">
      {rows.map((r, i) => (
        <Row key={r.key} {...r} first={i === 0} last={i === rows.length - 1} />
      ))}
    </ol>
  );
}
