"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarOutlined, CloseCircleFilled } from "@ant-design/icons";
import { dateBounds, fmtLong, fmtShort, isIsoDate, quickDates } from "@/app/lib/boardingDate";

// Yesterday / Today / Tomorrow shortcuts plus a native calendar. Used on the home search
// (variant "field") and at the top of the train page (variant "bar").
function Chip({ on, top, bottom, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`relative flex min-h-[46px] flex-col items-center justify-center rounded-xl border px-2 py-1 text-center leading-tight transition active:scale-95 ${
        on
          ? "border-[#704D25] bg-[#704D25] text-white shadow-sm"
          : "border-[#D6872A]/60 bg-white text-gray-700 hover:bg-[#faf3ea]"
      }`}
    >
      {children || (
        <>
          <span className="text-xs">{top}</span>
          <span className="text-[13px] font-semibold">{bottom}</span>
        </>
      )}
    </button>
  );
}

export default function BoardingDate({ value = "", onChange, variant = "field", hint }) {
  // Dates are worked out after mount: the home page is pre-built, so "today" must not be baked in.
  const [dates, setDates] = useState(null);
  const [bounds, setBounds] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    setDates(quickDates());
    setBounds(dateBounds());
  }, []);

  const pick = (iso) => onChange(iso === value ? "" : iso); // tapping the chosen day again clears it
  const openCalendar = () => {
    try {
      inputRef.current?.showPicker?.();
    } catch {
      /* browsers without showPicker still open the native picker on tap */
    }
  };

  // Invisible native input on top of the visible control: the phone's own date picker opens on tap.
  const nativeInput = (
    <input
      ref={inputRef}
      type="date"
      value={isIsoDate(value) ? value : ""}
      min={bounds.min}
      max={bounds.max}
      onClick={openCalendar}
      onChange={(e) => onChange(isIsoDate(e.target.value) ? e.target.value : "")}
      aria-label="Boarding date"
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
    />
  );

  const chips = dates ? (
    dates.map((d) => (
      <Chip key={d.iso} on={value === d.iso} top={d.short} bottom={d.label} onClick={() => pick(d.iso)} />
    ))
  ) : (
    [0, 1, 2].map((i) => <div key={i} className="h-[46px] animate-pulse rounded-xl bg-gray-100" aria-hidden="true" />)
  );

  if (variant === "bar") {
    const custom = value && dates && !dates.some((d) => d.iso === value);
    return (
      <div role="group" aria-label="Choose train date" className="grid grid-cols-4 gap-2">
        {chips}
        <div className="relative">
          <Chip on={!!custom} onClick={openCalendar}>
            {custom ? (
              <>
                <span className="text-xs">{fmtShort(value)}</span>
                <span className="text-[13px] font-semibold">Selected</span>
              </>
            ) : (
              <>
                <CalendarOutlined className="text-base" />
                <span className="text-[11px]">Pick date</span>
              </>
            )}
          </Chip>
          {nativeInput}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex h-12 items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:ring-2 focus-within:ring-[#D6872A]">
        <span className={`flex-1 self-center truncate px-4 text-base ${value ? "text-gray-900" : "text-gray-400"}`}>
          {isIsoDate(value) ? fmtLong(value) : "Boarding Date"}
        </span>
        {value && (
          <button
            type="button"
            aria-label="Clear boarding date"
            onClick={() => onChange("")}
            className="relative z-10 grid w-10 place-items-center text-gray-400 hover:text-gray-600"
          >
            <CloseCircleFilled />
          </button>
        )}
        <span className="grid w-12 place-items-center border-l border-gray-200 bg-gray-50 text-lg text-[#704D25]" aria-hidden="true">
          <CalendarOutlined />
        </span>
        {nativeInput}
      </div>
      <div role="group" aria-label="Quick boarding dates" className="mt-2 grid grid-cols-3 gap-2">
        {chips}
      </div>
      {hint && <p className="mt-2 text-center text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
