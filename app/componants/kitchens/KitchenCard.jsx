"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { offerLabel } from "@/app/lib/offers";
import { prefetchVendorMenu } from "@/app/lib/publicApi";

const DEFAULT_RATING = 4.5; // shown until a kitchen has its own rating

function Icon({ d, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-4 w-4 shrink-0 ${className}`} fill="currentColor">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm.75-13h-1.5v5.6l4.6 2.76.75-1.23-3.85-2.28V7Z",
  bike: "M5 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM19 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5ZM15.5 5H13v1.5h1.9l1.3 2.5H10l-1-2H6v1.5h2.1l1.7 3.4-1 1.6h2l.6-1h3.4l1 2 1.4-.7-1-2 .9-1.5 1.1 2.1 1.3-.7L15.5 5Z",
  offer: "m21.4 11.6-1.5-1.6.2-2.2-2.1-.5-1.1-1.9-2 .9L12.9 5l-1.8 1.3-2-.9L8 7.3l-2.1.5.2 2.2-1.5 1.6 1.5 1.6-.2 2.2 2.1.5 1.1 1.9 2-.9 1.8 1.3 1.8-1.3 2 .9 1.1-1.9 2.1-.5-.2-2.2 1.5-1.6ZM9.5 8.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm5 7a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm-5.3.2-1-1 6.3-6.3 1 1-6.3 6.3Z",
  leaf: "M20 4s-8.5-.6-12.6 3.5C4.3 10.6 5 15 5 15l-2.5 2.5L3.9 19l2.6-2.6s4.4.7 7.5-2.4C18.1 9.9 20 4 20 4Zm-6.9 8.8c-1.8 1.8-4 2.2-5.2 2.2l5.4-5.4-1-1-5.4 5.4c0-1.2.4-3.4 2.2-5.2 2.5-2.5 6.9-3.1 9-3.2-.1 2.1-.6 4.7-3 7.2Z",
  star: "m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3l5.4 4.7-1.6 7z",
};

const isPureVeg = (types = []) => types.length > 0 && types.every((t) => /^veg/i.test(t));

/**
 * One kitchen, food-app style: photo, name + rating, timing / minimum / delivery,
 * the best live coupon (from the backend) and a veg tag. The whole card is a link.
 */
function KitchenCard({ vendor, offer, priority = false, onSelect }) {
  const href = `/menu?vendor=${vendor._id}`;
  const rating = Number(vendor.rating) || DEFAULT_RATING;
  const pureVeg = isPureVeg(vendor.Food_Type);
  const delivery = vendor.Delivery_Charges > 0 ? `₹${vendor.Delivery_Charges} delivery` : "Free delivery";
  const weeklyOff = vendor.Weekly_Off && !/^no/i.test(vendor.Weekly_Off) ? `Closed ${vendor.Weekly_Off}` : "";
  const warm = () => prefetchVendorMenu(vendor._id);

  return (
    <Link
      href={href}
      onClick={() => onSelect?.(vendor)}
      onPointerEnter={warm}
      onTouchStart={warm}
      onFocus={warm}
      aria-label={`Order from ${vendor.Vendor_Name}`}
      className="block overflow-hidden rounded-[20px] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition hover:shadow-[0_6px_22px_rgba(0,0,0,0.12)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6872A]"
    >
      <div className="relative aspect-[2/1] w-full bg-gray-100">
        {vendor.image ? (
          <Image
            src={vendor.image}
            alt={vendor.Vendor_Name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, 560px"
            className="object-cover"
          />
        ) : (
          <Image src="/images/special-veg-thali.jpg" alt="" fill sizes="(max-width: 640px) 100vw, 560px" className="object-cover" />
        )}
        {vendor.itemCount > 0 && (
          <span className="absolute left-3 top-3 rounded-lg bg-black/65 px-2 py-1 text-[11.5px] font-semibold text-white">
            {vendor.itemCount} dishes{vendor.minPrice != null && ` · from ₹${Math.round(vendor.minPrice)}`}
          </span>
        )}
      </div>

      <div className="px-4 pb-3 pt-3">
        <div className="flex items-start justify-between gap-3">
          {/* the site forces h1-h4 sizes with !important, so a heading role keeps the size */}
          <p role="heading" aria-level={3} className="min-w-0 truncate text-[17px] font-bold leading-snug text-gray-900">
            {vendor.Vendor_Name}
          </p>
          <span
            className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-lg bg-green-700 px-1.5 py-0.5 text-xs font-bold text-white"
            aria-label={`Rated ${rating.toFixed(1)} out of 5`}
          >
            <Icon d={ICONS.star} className="!h-3 !w-3" />
            {rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Icon d={ICONS.clock} className="text-gray-500" />
            {vendor.Min_Order_Time} mins
          </span>
          <span className="text-gray-300">|</span>
          <span>Min ₹{vendor.Min_Order_Value}</span>
          <span className="text-gray-300">|</span>
          <span className="inline-flex items-center gap-1">
            <Icon d={ICONS.bike} className="text-gray-500" />
            {delivery}
          </span>
        </p>

        {offer && (
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-gray-700">
            <Icon d={ICONS.offer} className="text-blue-600" />
            <span className="truncate">{offerLabel(offer)}</span>
            <span className="shrink-0 rounded border border-dashed border-blue-300 px-1 text-[11px] font-bold text-blue-700">
              {offer.code}
            </span>
          </p>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-dashed border-gray-200 pt-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            <Icon d={ICONS.leaf} className={pureVeg ? "text-green-600" : "text-amber-600"} />
            {pureVeg ? "Pure Veg restaurant" : "Veg & Non-Veg"}
          </span>
          <span className="truncate text-right text-[11.5px] text-gray-500">
            {weeklyOff || vendor.Working_Time}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default memo(KitchenCard);
