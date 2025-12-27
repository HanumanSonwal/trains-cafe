"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Switch, Spin, Collapse, Button, Badge } from "antd";
import { getVendorCategoriesAndMenuItems } from "@/services/vendors";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import MenuItems from "./MenuItems";
import {
  ArrowRightOutlined,
  LoadingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useSelector } from "react-redux";
import MenuContent from "./MenuContent";

const { Panel } = Collapse;

export default function MenuClient() {
  const [isVegCategory, setIsVegCategory] = useState(true);
  const [allCategories, setAllCategories] = useState({ veg: [], nonVeg: [] });
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");
  const cartItems = useSelector((state) => state.cart.items);

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
  const totalUniqueItems = cartItems.length;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
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

      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#704D25] mb-2">Our Categories</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select a category to see the delicious menu items.
        </p>
      </div>

      {!loading && categories.length > 0 ? (
        <Collapse
          accordion
          expandIconPosition="end"
          className="bg-white rounded shadow"
        >
          {categories.map((cat) => (
            <Panel
              key={cat._id}
              header={
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={cat.categoryImage}
                      alt={cat.categoryName}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#704D25]">
                    {cat.categoryName}
                  </h3>
                </div>
              }
            >
              <h4 className="text-base font-bold mb-3 text-[#704D25]">
                {cat.categoryName} Menu
              </h4>
              {cat.items?.length > 0 ? (
                <MenuItems items={cat.items} />
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No items available in this category.
                </div>
              )}
            </Panel>
          ))}
        </Collapse>
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

      <div className="relative mx-auto max-w-[590px]">
        {totalUniqueItems > 0 && (
          <div className="fixed bottom-[56px] inset-x-0 flex justify-center z-50 px-4 pb-4">
            <div className="w-full max-w-[590px] px-4">
              <Link href="/cart" passHref className="w-full">
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#d6872a",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  className="w-full items-center px-6 py-6 rounded-md"
                >
                  <Badge count={totalUniqueItems} offset={[0, 0]}>
                    <ShoppingCartOutlined className="text-2xl text-green-500" />
                  </Badge>

                  <div className="flex items-center">
                    Next <ArrowRightOutlined className="ml-1" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
