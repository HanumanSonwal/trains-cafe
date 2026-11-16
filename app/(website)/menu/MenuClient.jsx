"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Switch, Spin } from "antd";
import { getVendorCategoriesAndMenuItems } from "@/services/vendors";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import MenuItems from "./MenuItems";
import CategoryNav from "./CategoryNav";
import OrderBar from "./OrderBar";
import { LoadingOutlined } from "@ant-design/icons";
import MenuContent from "./MenuContent";

const sectionId = (id) => `cat-${id}`;

export default function MenuClient() {
  const [isVegCategory, setIsVegCategory] = useState(true);
  const [allCategories, setAllCategories] = useState({ veg: [], nonVeg: [] });
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [headerH, setHeaderH] = useState(72); // the site header is sticky; the category bar sits under it

  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");

  const fetchAllCategories = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const [vegRes, nonVegRes] = await Promise.all([
        getVendorCategoriesAndMenuItems(vendorId, true),
        getVendorCategoriesAndMenuItems(vendorId, false),
      ]);
      setAllCategories({
        veg: vegRes || [],
        nonVeg: nonVegRes || [],
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const categories = useMemo(
    () => (isVegCategory ? allCategories.veg : allCategories.nonVeg),
    [isVegCategory, allCategories]
  );

  const vendorInfo = categories[0] || {};

  // Measure the real header height once and on resize.
  useEffect(() => {
    const measure = () => {
      const h = document.querySelector("div.sticky.top-0")?.offsetHeight;
      if (h) setHeaderH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Scroll-spy: the active category is the last one whose top has passed the sticky bars.
  useEffect(() => {
    if (!categories.length) return;
    setActiveId(categories[0]._id);
    const line = headerH + 70;
    // A handful of rect reads per scroll event; setState with the same id is a no-op.
    const onScroll = () => {
      let current = categories[0]._id;
      for (const c of categories) {
        const el = document.getElementById(sectionId(c._id));
        if (el && el.getBoundingClientRect().top <= line) current = c._id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories, headerH]);

  const jumpTo = useCallback((id) => {
    setActiveId(id);
    document.getElementById(sectionId(id))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      className="mx-auto w-full max-w-3xl bg-white p-4 pb-40"
      style={{ "--hdr": `${headerH}px` }}
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 36, color: "#d6872a" }}
                spin
              />
            }
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
          {vendorInfo.categoryImage ? (
            <div className="relative w-full h-52">
              <Image
                src={vendorInfo.categoryImage}
                alt={vendorInfo.vendor || "N/A"}
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-200 h-52 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          <div className="p-5">
            <h1 className="text-2xl font-extrabold text-[#704D25] mb-1">
              {vendorInfo.vendor || "N/A"}
            </h1>
            <p className="text-gray-500 mb-1 text-sm">
              {vendorInfo.station || "N/A"} Railway Station
            </p>
            <p className="text-sm text-gray-500">
              North Indian, Punjabi, Mughlai, Chinese, South Indian, Bengali
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                4.5 ⭐
              </span>
              <span className="text-xs text-gray-500">
                Pure Veg | Min Order ₹99 | 30 mins
              </span>
            </div>
            <div className="mt-4">
              <Switch
                checked={isVegCategory}
                onChange={setIsVegCategory}
                checkedChildren="VEG"
                unCheckedChildren="NON-VEG"
              />
            </div>
          </div>
        </div>
      )}

      {!loading && categories.length > 0 ? (
        <>
          <CategoryNav categories={categories} activeId={activeId} onPick={jumpTo} />

          <div>
            <div className="space-y-8">
              {categories.map((cat) => (
                <section
                  key={cat._id}
                  id={sectionId(cat._id)}
                  aria-label={cat.categoryName}
                  className="scroll-mt-[calc(var(--hdr,72px)+64px)]"
                >
                  {/* the site forces h1-h4 sizes with !important, so a heading role keeps the size */}
                  <p role="heading" aria-level={2} className="mb-3 text-lg font-bold text-[#704D25]">
                    {cat.categoryName}
                    <span className="ml-1.5 text-sm font-medium text-gray-400">({cat.items?.length || 0})</span>
                  </p>
                  {cat.items?.length > 0 ? (
                    <MenuItems items={cat.items} />
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No items available in this category.
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </>
      ) : !loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">😢</div>
          <h3 className="text-lg font-bold text-[#704D25] mb-2">
            Oops! {isVegCategory ? "Veg" : "Non-Veg"} Items Not Available
          </h3>
          <p className="text-gray-500 mb-4">
            Please try other options or switch back.
          </p>
        </div>
      ) : null}

      <MenuContent categories={categories} />

      <OrderBar />
    </div>
  );
}
