"use client";

import { useEffect, useMemo, useState } from "react";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import KitchenCard from "./KitchenCard";
import { bestOffer } from "@/app/lib/offers";
import { fetchStationVendors, peekStationVendors, prefetchVendorMenu } from "@/app/lib/publicApi";
import { trackContact } from "@/app/lib/analytics";

const phone = process.env.NEXT_PUBLIC_PHONE;
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] bg-white ring-1 ring-black/5" aria-hidden="true">
      <div className="aspect-[2/1] w-full animate-pulse bg-gray-200/70" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200/70" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200/70" />
        <div className="h-3 w-2/5 animate-pulse rounded bg-gray-200/70" />
      </div>
    </div>
  );
}

function ContactFallback({ title, place }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center ring-1 ring-black/5">
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-600">Please order food by call or WhatsApp.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <a
          href={`tel:${phone}`}
          onClick={() => trackContact("call", place)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#704D25] px-4 text-sm font-semibold text-white hover:bg-[#5a3d1d]"
        >
          <PhoneOutlined /> Call Us
        </a>
        <a
          href={`https://wa.me/${whatsapp}`}
          onClick={() => trackContact("whatsapp", place)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          <WhatsAppOutlined className="text-green-600" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

/**
 * Active kitchens at one station. Data comes from the cached public API; the
 * first menus are fetched in the background so opening a kitchen is instant.
 */
export default function KitchenList({ stationCode, stationName, onSelect, place = "station" }) {
  const cached = peekStationVendors(stationCode);
  const [state, setState] = useState(() =>
    cached
      ? { loading: false, error: false, vendors: cached.data || [], offers: cached.offers || [] }
      : { loading: true, error: false, vendors: [], offers: [] }
  );

  useEffect(() => {
    if (!stationCode) return;
    let alive = true;
    fetchStationVendors(stationCode)
      .then((json) => {
        if (!alive) return;
        const vendors = json.data || [];
        setState({ loading: false, error: false, vendors, offers: json.offers || [] });
        // warm the first menus while the visitor is still looking at the list
        setTimeout(() => vendors.slice(0, 3).forEach((v) => prefetchVendorMenu(v._id)), 400);
      })
      .catch(() => alive && setState({ loading: false, error: true, vendors: [], offers: [] }));
    return () => {
      alive = false;
    };
  }, [stationCode]);

  const offer = useMemo(() => bestOffer(state.offers), [state.offers]);

  if (state.loading) {
    return (
      <div className="grid gap-4 py-3" aria-busy="true" aria-label="Loading kitchens">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }
  if (state.error) return <ContactFallback title="Couldn't load kitchens right now" place={place} />;
  if (!state.vendors.length) {
    return <ContactFallback title={`No kitchens found${stationName ? ` at ${stationName}` : " for this station"}.`} place={place} />;
  }

  return (
    <div className="grid gap-4 py-3">
      {state.vendors.map((vendor, i) => (
        <KitchenCard key={vendor._id} vendor={vendor} offer={offer} priority={i < 1} onSelect={onSelect} />
      ))}
    </div>
  );
}
