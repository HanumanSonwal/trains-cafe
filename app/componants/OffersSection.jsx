"use client";

import { useEffect, useState } from "react";
import { fetchOffers } from "@/app/lib/publicApi";
import { rupees } from "@/app/lib/offers";
import { Bar } from "@/app/componants/Skeletons";

const dateLabel = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const isPercent = (o) => o.discount?.type === "percentage";

/**
 * A coupon "ticket": brand-coloured stub with the discount on the left, a
 * perforated edge, then the offer text and a tap-to-copy code on the right.
 */
function Ticket({ offer }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const value = Number(offer.discount?.value) || 0;

  return (
    <li className="w-[290px] shrink-0 snap-start sm:w-[320px]">
      <div className="relative flex h-full overflow-hidden rounded-2xl bg-[#fffaf3] shadow-[0_4px_16px_rgba(112,77,37,0.14)] ring-1 ring-[#704D25]/10">
        {/* stub */}
        <div className="relative flex w-[92px] shrink-0 flex-col items-center justify-center bg-gradient-to-b from-[#D6872A] to-[#704D25] px-2 py-4 text-white">
          <span className="text-[30px] font-black leading-none tracking-tight">
            {isPercent(offer) ? `${value}%` : `₹${value}`}
          </span>
          <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">off</span>
          {/* perforation: half circles cut into the divider */}
          <span aria-hidden="true" className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-white" />
          <span aria-hidden="true" className="absolute -bottom-2.5 -right-2.5 h-5 w-5 rounded-full bg-white" />
        </div>

        {/* body */}
        <div className="flex min-w-0 flex-1 flex-col border-l-2 border-dashed border-[#704D25]/25 p-3.5 pl-4">
          {/* the site forces h1-h4 sizes with !important, so a heading role keeps the size */}
          <p role="heading" aria-level={3} className="text-[15px] font-bold leading-snug text-[#3b2a14]">
            {offer.title}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-gray-600">
            {offer.description || `Valid till ${dateLabel(offer.endDate)}`}
          </p>
          <p className="mt-1 text-[11.5px] font-semibold text-[#B8651B]">On orders above {rupees(offer.minimumAmount)}</p>

          <button
            type="button"
            onClick={copy}
            aria-label={`Copy coupon code ${offer.code}`}
            className="mt-auto flex w-fit items-center gap-2 pt-3 text-left"
          >
            <span className="rounded-md bg-[#704D25] px-2.5 py-1 text-[13px] font-extrabold tracking-wider text-white">
              {offer.code}
            </span>
            <span className={`text-[11px] font-semibold ${copied ? "text-green-700" : "text-gray-500"}`}>
              {copied ? "Copied ✓" : "Tap to copy"}
            </span>
          </button>
        </div>
      </div>
    </li>
  );
}

/**
 * Home page coupons: the live offers from the backend (coupon management) as a
 * swipeable row of tickets. Hidden when there are none.
 */
export default function OffersSection() {
  const [offers, setOffers] = useState(null); // null = loading

  useEffect(() => {
    let alive = true;
    fetchOffers()
      .then((json) => alive && setOffers(json.data || []))
      .catch(() => alive && setOffers([]));
    return () => {
      alive = false;
    };
  }, []);

  if (offers && offers.length === 0) return null;

  return (
    <section aria-labelledby="offers-home-h" className="mx-auto mt-10 w-full max-w-3xl bg-white py-6">
      <div className="px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D6872A]">Coupons</p>
        <h2 id="offers-home-h" className="mt-0.5 !text-[24px] font-extrabold leading-tight text-[#3b2a14]">
          Save more on your train meal
        </h2>
        <p className="mt-1 text-sm text-gray-500">Copy a code and apply it at checkout.</p>
      </div>

      <ul className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {offers === null
          ? [0, 1, 2].map((i) => (
              <li key={i} className="w-[290px] shrink-0 sm:w-[320px]" aria-hidden="true">
                <Bar className="h-[132px] !rounded-2xl" />
              </li>
            ))
          : offers.map((o) => <Ticket key={o._id} offer={o} />)}
      </ul>
    </section>
  );
}
