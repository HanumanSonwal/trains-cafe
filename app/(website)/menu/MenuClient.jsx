"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addStationDetails, addVendorDetails } from "@/app/redux/cartSlice";
import Image from "next/image";
import { trackViewMenu } from "@/app/lib/analytics";
import { fetchVendorMenu, peekVendorMenu } from "@/app/lib/publicApi";
import MenuItems from "./MenuItems";
import MenuFab from "./MenuFab";
import OrderBar from "./OrderBar";
import MenuContent from "./MenuContent";
import { MenuSkeleton } from "@/app/componants/Skeletons";

const sectionId = (id) => `cat-${id}`;
const DEFAULT_RATING = 4.5;

function VegToggle({ veg, onChange }) {
  return (
    <div role="group" aria-label="Food type" className="inline-flex rounded-full bg-gray-100 p-0.5 text-xs font-semibold">
      {[
        [true, "Veg", "bg-green-600"],
        [false, "Non-Veg", "bg-red-600"],
      ].map(([value, label, dot]) => (
        <button
          key={label}
          type="button"
          aria-pressed={veg === value}
          onClick={() => onChange(value)}
          className={`inline-flex min-h-[30px] items-center gap-1.5 rounded-full px-3 transition ${
            veg === value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

export default function MenuClient() {
  const vendorId = useSearchParams().get("vendor");
  // a menu warmed up on the kitchen list renders at once, without a spinner
  const [menu, setMenu] = useState(() => (vendorId ? peekVendorMenu(vendorId) : null));
  const [status, setStatus] = useState(menu ? "ready" : "loading");
  const [veg, setVeg] = useState(true);
  const [headerH, setHeaderH] = useState(72); // the site header is sticky

  useEffect(() => {
    if (!vendorId) return setStatus("missing");
    let alive = true;
    const cached = peekVendorMenu(vendorId);
    if (cached) {
      setMenu(cached);
      setStatus("ready");
    } else {
      setStatus("loading");
    }
    fetchVendorMenu(vendorId)
      .then((json) => {
        if (!alive) return;
        if (json.notFound) return setStatus("missing");
        setMenu(json);
        setStatus("ready");
      })
      .catch(() => alive && !cached && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [vendorId]);

  // Start on whichever list has food (a pure non-veg kitchen opens on non-veg).
  const hasVeg = Boolean(menu?.veg?.length);
  const hasNonVeg = Boolean(menu?.nonVeg?.length);
  useEffect(() => {
    if (menu && !hasVeg && hasNonVeg) setVeg(false);
  }, [menu, hasVeg, hasNonVeg]);

  const categories = useMemo(() => (veg ? menu?.veg : menu?.nonVeg) || [], [menu, veg]);
  const vendor = menu?.vendor || {};

  // view_menu once per vendor
  const menuTracked = useRef("");
  useEffect(() => {
    if (status !== "ready" || !vendor.Vendor_Name || menuTracked.current === vendorId) return;
    menuTracked.current = vendorId;
    trackViewMenu(vendor.Vendor_Name, vendor.Station_Name, (menu.veg?.length || 0) + (menu.nonVeg?.length || 0));
  }, [status, vendor.Vendor_Name, vendor.Station_Name, vendorId, menu]);

  // Opened straight from a link (not from a kitchen list): with an empty cart, remember
  // this kitchen and its station so checkout has them.
  const dispatch = useDispatch();
  const cartVendorId = useSelector((s) => s.cart.vendor?._id);
  const cartEmpty = useSelector((s) => s.cart.items.length === 0);
  useEffect(() => {
    if (status !== "ready" || !vendor._id || cartVendorId === vendor._id || !cartEmpty) return;
    dispatch(addVendorDetails({ ...vendor }));
    dispatch(
      addStationDetails({
        name: vendor.Station_Name,
        code: vendor.Station_Code,
        station_name: vendor.Station_Name,
        station_code: vendor.Station_Code,
      })
    );
  }, [status, vendor, cartVendorId, cartEmpty, dispatch]);

  useEffect(() => {
    const measure = () => {
      const h = document.querySelector("div.sticky.top-0")?.offsetHeight;
      if (h) setHeaderH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pureVeg = vendor.Food_Type?.length > 0 && vendor.Food_Type.every((t) => /^veg/i.test(t));
  const rating = Number(vendor.rating) || DEFAULT_RATING;

  return (
    <div className="mx-auto w-full max-w-3xl bg-white p-4 pb-48" style={{ "--hdr": `${headerH}px` }}>
      {status === "loading" && <MenuSkeleton />}

      {(status === "error" || status === "missing") && (
        <div className="py-12 text-center">
          <p className="text-lg font-bold text-[#704D25]">
            {status === "missing" ? "This kitchen could not be found" : "We couldn't load the menu"}
          </p>
          <p className="mt-1 text-sm text-gray-500">Please go back and pick a kitchen again.</p>
          {status === "error" && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 min-h-[40px] rounded-full bg-[#704D25] px-5 text-sm font-semibold text-white"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow ring-1 ring-black/5">
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={vendor.image || categories[0]?.categoryImage || "/images/special-veg-thali.jpg"}
                alt={vendor.Vendor_Name || "Kitchen"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="!text-[22px] font-extrabold leading-tight text-[#704D25]">{vendor.Vendor_Name}</h1>
                <span className="mt-1 shrink-0 rounded-lg bg-green-700 px-1.5 py-0.5 text-xs font-bold text-white">
                  {rating.toFixed(1)} ★
                </span>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{vendor.Station_Name} Railway Station</p>
              <p className="mt-2 text-[13px] text-gray-600">
                {pureVeg ? "Pure Veg" : "Veg & Non-Veg"} · Min order ₹{vendor.Min_Order_Value} · Order {vendor.Min_Order_Time} min before ·{" "}
                {vendor.Delivery_Charges > 0 ? `₹${vendor.Delivery_Charges} delivery` : "Free delivery"}
              </p>
              {vendor.Working_Time && <p className="mt-0.5 text-xs text-gray-500">Serving {vendor.Working_Time}</p>}
              {hasVeg && hasNonVeg && (
                <div className="mt-3">
                  <VegToggle veg={veg} onChange={setVeg} />
                </div>
              )}
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-8">
              {categories.map((cat) => (
                <section
                  key={cat._id}
                  id={sectionId(cat._id)}
                  aria-label={cat.categoryName}
                  className="scroll-mt-[calc(var(--hdr,72px)+12px)]"
                >
                  {/* the site forces h1-h4 sizes with !important, so a heading role keeps the size */}
                  <p role="heading" aria-level={2} className="mb-3 flex items-center justify-center gap-3 text-lg font-bold text-[#704D25]">
                    <span className="h-px w-8 bg-[#704D25]/30" aria-hidden="true" />
                    {cat.categoryName}
                    <span className="text-sm font-medium text-gray-400">({cat.items.length})</span>
                    <span className="h-px w-8 bg-[#704D25]/30" aria-hidden="true" />
                  </p>
                  <MenuItems items={cat.items} />
                </section>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg font-bold text-[#704D25]">No {veg ? "veg" : "non-veg"} items right now</p>
              <p className="mt-1 text-sm text-gray-500">Please check back soon or order by call.</p>
            </div>
          )}

          <MenuContent categories={categories} />
          <MenuFab categories={categories} sectionId={sectionId} headerOffset={headerH} />
        </>
      )}

      <OrderBar />
    </div>
  );
}
