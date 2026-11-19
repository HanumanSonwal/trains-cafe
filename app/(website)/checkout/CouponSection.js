"use client";

import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { CheckCircleFilled, TagFilled } from "@ant-design/icons";
import { fetchOffers } from "@/app/lib/publicApi";
import { offerLabel, offerSaving } from "@/app/lib/offers";

const money = (n) => `₹${(Math.round((Number(n) || 0) * 100) / 100).toLocaleString("en-IN")}`;

/**
 * Offers & coupons, shown above the bill. Live coupons come from the backend
 * (/api/public/offers); each shows what it saves on this cart, or how much more
 * to add. A code can also be typed in. The server checks it again at place-order.
 */
export default function CouponSection({ mobile, items = [], couponCode, onApplied, onRemoved, onNeedMobile }) {
  const [offers, setOffers] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(""); // code being checked
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchOffers()
      .then((json) => alive && setOffers(json.data || []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const subTotal = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.Final_Price ?? i.price) || 0) * i.quantity, 0),
    [items]
  );

  const apply = async (rawCode) => {
    const code = String(rawCode || "").trim().toUpperCase();
    if (!code) return setError("Please enter a coupon code");
    if (!/^\d{10}$/.test(String(mobile || ""))) {
      setError("");
      message.warning("Please enter your mobile number first");
      onNeedMobile?.();
      return;
    }
    setBusy(code);
    setError("");
    try {
      const res = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          phone: mobile,
          cart: items.map(({ _id, quantity, Final_Price, price }) => ({ _id, quantity, price: Final_Price ?? price })),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || "This coupon can't be used");
      setSaved(json.discount);
      setInput("");
      onApplied(code, json.discount);
      message.success(`${code} applied! You save ${money(json.discount)}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  };

  const remove = () => {
    onRemoved();
    setSaved(0);
    setError("");
  };

  return (
    <section aria-labelledby="offers-h" className="mt-4 rounded-lg bg-white p-4 shadow">
      <div className="mb-3 flex items-center gap-2">
        <TagFilled className="text-[#D6872A]" />
        <p id="offers-h" role="heading" aria-level={2} className="text-base font-bold text-gray-900">
          Offers &amp; Coupons
        </p>
      </div>

      {couponCode ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircleFilled className="text-lg text-green-600" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-green-800">{couponCode} applied</p>
              <p className="text-xs text-green-700">You save {money(saved)} on this order</p>
            </div>
          </div>
          <button type="button" onClick={remove} className="shrink-0 text-sm font-semibold text-red-600 hover:underline">
            Remove
          </button>
        </div>
      ) : (
        // a div, not a form: this sits inside the checkout form
        <div
          className={`flex items-center gap-2 rounded-xl border bg-white py-1 pl-3 pr-1 focus-within:ring-2 focus-within:ring-[#D6872A] ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        >
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value.toUpperCase().slice(0, 12));
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Enter here applies the coupon, it must not place the order
                apply(input);
              }
            }}
            placeholder="Enter coupon code"
            aria-label="Coupon code"
            autoCapitalize="characters"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => apply(input)}
            disabled={!!busy}
            className="h-9 shrink-0 rounded-lg bg-[#D49929] px-4 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-60"
          >
            {busy && busy === input.trim().toUpperCase() ? "Checking…" : "Apply"}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}

      {offers.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {offers.map((o) => {
            const saving = offerSaving(o, subTotal);
            const short = Math.max(0, Math.ceil((o.minimumAmount || 0) - subTotal));
            const applied = couponCode === o.code;
            return (
              <li
                key={o._id}
                className={`relative overflow-hidden rounded-xl border border-dashed px-3 py-2.5 ${
                  applied ? "border-green-300 bg-green-50/60" : "border-[#D6872A]/50 bg-[#fffaf2]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[13px] font-extrabold tracking-wide text-[#704D25] ring-1 ring-[#D6872A]/40">
                        {o.code}
                      </span>
                      <span className="text-[13px] font-semibold text-gray-800">{offerLabel(o)}</span>
                    </p>
                    {o.title && <p className="mt-1 truncate text-xs text-gray-500">{o.title}</p>}
                    <p className={`mt-0.5 text-xs font-medium ${saving > 0 ? "text-green-700" : "text-gray-500"}`}>
                      {saving > 0 ? `Save ${money(saving)} on this order` : `Add ${money(short)} more to unlock`}
                    </p>
                  </div>
                  {!applied && (
                    <button
                      type="button"
                      onClick={() => apply(o.code)}
                      disabled={saving <= 0 || !!busy || !!couponCode}
                      className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold uppercase text-[#D6872A] transition hover:bg-[#faf3ea] disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      {busy === o.code ? "…" : "Apply"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
