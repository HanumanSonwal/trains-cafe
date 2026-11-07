"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createStationSlug, createTrainSlug } from "@/utils/slugify";
import { MIN_QUERY_LENGTH } from "@/app/lib/searchConfig";
import { loadSuggestions, useSuggestions } from "@/app/hooks/useSuggestions";

const MODES = [
  { key: "pnr", label: "PNR", placeholder: "Enter PNR Number to Order", inputMode: "numeric" },
  { key: "train", label: "Train Name/No.", placeholder: "Enter Train Name or Number", inputMode: "text" },
  { key: "station", label: "Station", placeholder: "Enter Station Name or Code", inputMode: "text" },
];

const optionKey = (mode, o) => (mode === "train" ? o.number : o.code);
const optionLabel = (mode, o) => `${o.name} (${optionKey(mode, o)})`;
const optionHref = (mode, o) => `/${mode}s/${o.slug}`; // /trains/... or /stations/...
const isExactMatch = (mode, o, q) =>
  mode === "train" ? o.number === q : o.code.toLowerCase() === q.toLowerCase();

export default function OrderFood() {
  const router = useRouter();
  const uid = useId();
  const listId = `${uid}-list`;
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const [mode, setMode] = useState("pnr");
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(null); // suggestion the user picked
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const current = useMemo(() => MODES.find((m) => m.key === mode), [mode]);
  const isLookup = mode !== "pnr";

  // Debounced + cached + de-duplicated suggestions (see useSuggestions).
  const { options, loading: searching, error: searchError } = useSuggestions(
    mode,
    value,
    isLookup && !selected
  );

  useEffect(() => setActive(options.length ? 0 : -1), [options]);

  // Close the list when tapping outside the form.
  useEffect(() => {
    const onDown = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setValue("");
    setSelected(null);
    setError("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const onChange = (e) => {
    const text = e.target.value;
    setError("");
    setSelected(null);
    if (mode === "pnr") {
      setValue(text.replace(/\D/g, "").slice(0, 10));
    } else {
      setValue(text.slice(0, 60));
      setOpen(true);
    }
  };

  const pick = (option) => {
    setSelected(option);
    setValue(optionLabel(mode, option));
    setOpen(false);
    setError("");
    inputRef.current?.focus();
  };

  const submitPnr = async (pnr) => {
    if (!/^\d{10}$/.test(pnr)) return setError("Please enter a valid 10 digit PNR number");
    // POST keeps the PNR (personal data) out of URLs, server logs and history.
    const res = await fetch("/api/railradar/pnr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pnr }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) throw new Error(json.message || "PNR not found");
    const { slug, date } = json.data;
    router.push(`/trains/${slug}${date ? `?date=${date}` : ""}`);
  };

  const submitLookup = async (query) => {
    if (selected) return router.push(optionHref(mode, selected));
    if (query.length < MIN_QUERY_LENGTH) {
      return setError(mode === "train" ? "Enter a train name or number" : "Enter a station name or code");
    }
    // Typed without picking: resolve through the same cache the list uses.
    const list = await loadSuggestions(mode, query);
    const match = list.find((o) => isExactMatch(mode, o, query)) || list[0];
    if (match) return router.push(optionHref(mode, match));

    // Search found nothing but the input still looks like a valid id.
    if (mode === "train" && /^\d{5}$/.test(query)) return router.push(`/trains/${createTrainSlug("train", query)}`);
    if (mode === "station" && /^[A-Za-z]{2,5}$/.test(query)) {
      return router.push(`/stations/${createStationSlug(query, query)}`);
    }
    setError(`No ${mode} found, please check and try again`);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const query = value.trim();
      await (mode === "pnr" ? submitPnr(query) : submitLookup(query));
    } catch (err) {
      setError(err.message || "Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (e) => {
    if (!isLookup) return;
    const count = options.length;
    if (e.key === "ArrowDown" && count) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % count);
    } else if (e.key === "ArrowUp" && count) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? count - 1 : i - 1));
    } else if (e.key === "Enter" && open && options[active]) {
      e.preventDefault();
      pick(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = isLookup && open && !selected && value.trim().length >= MIN_QUERY_LENGTH;
  const message = error || searchError;

  return (
    <section className="px-3 mt-8 mb-2">
      <div className="mx-auto w-full max-w-xl">
        <div className="relative text-center mb-4">
          <img
            src="/images/Order.png"
            alt="Food Delivery in Train"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-2/3"
          />
          <h2 className="text-[#704D25] text-xl sm:text-2xl font-bold relative z-10">
            Order Food on Trains Online
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 relative z-10">
            Get fresh, hygienic &amp; delicious meals from FSSAI certified restaurants
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-lg px-3 py-4 sm:px-5 sm:py-5">
          <div
            role="radiogroup"
            aria-label="Search by"
            className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-2 mb-4"
          >
            {MODES.map((m) => {
              const on = m.key === mode;
              return (
                <label key={m.key} className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none min-h-[32px]">
                  <input
                    type="radio"
                    name={`${uid}-mode`}
                    value={m.key}
                    checked={on}
                    onChange={() => switchMode(m.key)}
                    className="sr-only peer"
                  />
                  <span
                    aria-hidden="true"
                    className={`grid place-items-center h-5 w-5 rounded-full border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#D6872A] ${
                      on ? "border-[#704D25]" : "border-gray-400"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full bg-[#704D25] transition ${on ? "scale-100" : "scale-0"}`} />
                  </span>
                  <span
                    className={`text-xs min-[400px]:text-sm sm:text-base font-semibold uppercase ${
                      on ? "text-black" : "text-gray-600"
                    }`}
                  >
                    {m.label}
                  </span>
                </label>
              );
            })}
          </div>

          <form onSubmit={submit} ref={formRef} className="relative" noValidate>
            <div
              className={`flex items-center gap-2 rounded-full border bg-white pl-4 pr-1.5 py-1.5 shadow-sm transition focus-within:ring-2 focus-within:ring-[#D6872A] ${
                message ? "border-red-400" : "border-gray-200"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                inputMode={current.inputMode}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint={isLookup ? "search" : "go"}
                role={isLookup ? "combobox" : undefined}
                aria-expanded={isLookup ? showList : undefined}
                aria-controls={isLookup ? listId : undefined}
                aria-autocomplete={isLookup ? "list" : undefined}
                aria-label={current.placeholder}
                aria-invalid={!!message}
                value={value}
                onChange={onChange}
                onFocus={() => isLookup && setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder={current.placeholder}
                disabled={submitting}
                // text-base (16px) stops iOS from zooming the page on focus
                className="min-w-0 flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none py-2"
              />
              {isLookup && searching && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-[#704D25]"
                />
              )}
              <button
                type="submit"
                disabled={submitting}
                className="shrink-0 rounded-full bg-[#704D25] px-5 py-2.5 text-sm sm:text-base font-semibold text-white transition hover:bg-[#5a3d1d] active:scale-95 disabled:opacity-70"
              >
                {submitting ? "Please wait…" : "Submit"}
              </button>
            </div>

            {showList && (
              <ul
                id={listId}
                role="listbox"
                className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto overscroll-contain rounded-2xl border border-gray-100 bg-white py-1 text-left shadow-xl"
              >
                {options.length === 0 && !searching && (
                  <li className="px-4 py-3 text-sm text-gray-500">
                    {message || `No ${mode === "train" ? "trains" : "stations"} found`}
                  </li>
                )}
                {options.map((o, i) => (
                  <li
                    key={optionKey(mode, o)}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onPointerDown={(e) => {
                      e.preventDefault(); // keep input focus, select before blur
                      pick(o);
                    }}
                    className={`cursor-pointer px-4 py-3 ${i === active ? "bg-[#faf3ea]" : ""}`}
                  >
                    <div className="text-sm font-semibold text-gray-900 truncate">{o.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {mode === "train"
                        ? `${o.number} · ${o.fromName || o.from || ""} → ${o.toName || o.to || ""}`
                        : `${o.code}${o.city ? ` · ${o.city}` : ""}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <p role="alert" className={`mt-2 px-2 text-center text-xs sm:text-sm text-red-600 ${error ? "" : "hidden"}`}>
            {error}
          </p>

        </div>
      </div>
    </section>
  );
}
