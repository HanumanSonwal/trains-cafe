"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";

const { Panel } = Collapse;

export default function MenuPage() {
  const [isVegCategory, setIsVegCategory] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");
  const cartItems = useSelector((state) => state.cart.items);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const response = await getVendorCategoriesAndMenuItems(
      vendorId,
      isVegCategory
    );
    setCategories(response || []);
    setLoading(false);
  }, [vendorId, isVegCategory]);

  useEffect(() => {
    if (vendorId) fetchCategories();
  }, [fetchCategories, vendorId]);

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
        <h2 className="text-xl font-bold text-[#704D25] mb-2">
          Our Categories
        </h2>
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

      <div>
        <h2
          className="font-bold"
          style={{
            marginTop: "2rem",
            color: "#704d25",
          }}
        >
          Order{" "}
          <Link
            className="font-bold text-blue-600 hover:text-blue-800 underline"
            href="https://www.trainscafe.in/"
          >
            {" "}
            food in train{" "}
          </Link>{" "}
          from{" "}
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "}
          with Trainscafe
        </h2>
        <p className="py-2">
          Experience delicious, hygienic, and on-time food delivery in train
          from{" "}
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "}
          through Trainscafe – India’s trusted train food delivery partner.
        </p>
        <p className="py-2">
          Trainscafe delivers fresh meals directly to your train seat with
          E-catering partnership. Whether you're craving a light snack or a full
          meal,{" "}
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "}
          station is ready to serve passengers traveling across India with a
          multiple varieties range of food.{" "}
        </p>

        <h2
          className="font-bold mb-2"
          style={{
            color: "#704d25",
            marginTop: "2rem",
          }}
        >
          Why Choose Trainscafe for{" "}
          <Link
            className="font-bold text-blue-600 hover:text-blue-800 underline"
            href="https://www.trainscafe.in/online-train-food-delivery"
          >
            {" "}
            Online Train Food Delivery?{" "}
          </Link>
        </h2>
        <ul style={{ paddingLeft: "5%", listStyleType: "disc" }}>
          <li>
            <b>Expertise in Train Catering :</b> With years of experience in
            railway food delivery services, Trainscafe ensures every meal is
            prepared with care and delivered with precision.
          </li>
          <li>
            <b>Trusted by Thousands :</b> Daily serving 500+ trains and
            thousands of passengers across major Indian railway stations.
          </li>
          <li>
            <b>Real-time Tracking & Support :</b> Know when your food is being
            prepared, dispatched, and delivered with real-time updates.
          </li>
        </ul>

        <div>
          <h2
            className="font-bold"
            style={{
              marginTop: "2rem",
              color: "#704d25",
            }}
          >
            <strong>
              {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
            </strong>{" "}
            at{" "}
            <strong>
              {categories.length > 0 ? categories[0].station : "N/A"}
            </strong>{" "}
            Railway Station
          </h2>
          <p className="py-2">
            Trainscafe has tied up with{" "}
            <strong>
              {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
            </strong>{" "}
            to provide on-seat train food delivery at{" "}
            <strong>
              {categories.length > 0 ? categories[0].station : "N/A"}
            </strong>
            .
            <br />
            Whether you’re traveling alone or with family, or need group meal
            booking in train, Trainscafe ensures a smooth, satisfying food
            experience right at your berth.
          </p>
        </div>
        <div>
          <h2
            className="font-bold"
            style={{
              marginTop: "2rem",
              color: "#704d25",
            }}
          >
            How to{" "}
            <Link
              className="font-bold text-blue-600 hover:text-blue-800 underline"
              href="https://www.trainscafe.in/order-food-in-train"
            >
              {" "}
              Order Food Online in Train{" "}
            </Link>{" "}
            from{" "}
            <strong>
              {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
            </strong>{" "}
            at{" "}
            <strong>
              {categories.length > 0 ? categories[0].station : "N/A"}
            </strong>{" "}
            ?
          </h2>
          <h4 className="py-2">
            Order your favorite food on train is just a few simple steps away
          </h4>
          <ul style={{ paddingLeft: "5%", listStyleType: "decimal" }}>
            <li>
              Visit <b>Trainscafe Web App</b> or use our <b>Whatsapp</b>
            </li>
            <li>
              Enter Train no. / station name or PNR number (e.g.,{" "}
              <strong>
                {categories.length > 0 ? categories[0].station : "N/A"}
              </strong>
              )
            </li>

            <li>
              Choose{" "}
              <strong>
                {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
              </strong>{" "}
              from the list of available restaurants
            </li>
            <li>Select dishes from the displayed food menu</li>
            <li>Apply promo codes if available</li>
            <li>
              Pay online securely or choose <b>Cash on Delivery</b>
            </li>
            <li>
              Your food will be delivered directly to your train seat at{" "}
              <strong>
                {categories.length > 0 ? categories[0].station : "N/A"}
              </strong>{" "}
              station
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h2
          className="font-bold"
          style={{
            marginTop: "2rem",
            color: "#704d25",
          }}
        >
          👨‍👩‍👧‍👦 Bulk Order Facility in Train
        </h2>
        <p className="py-2">
          Traveling in a group? Trainscafe provides bulk food ordering for group
          train journeys from{" "}
          <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "}
          at{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>
          . Ideal for school trips, tour groups, and corporate teams,etc. ✅
          Custom Menus | ✅ Best Prices | ✅ Timely Delivery | ✅ PAN-India
          Station Coverage
        </p>
        <h5 className="py-2 font-bold">
          Need Help with Your Train Food Order?
        </h5>
        <p className="py-2">
          Call us on{" "}
          <Link
            href="tel:+918696963496"
            className="font-bold text-blue-600 hover:text-blue-800 underline"
          >
            +91-8696963496
          </Link>{" "}
          or WhatsApp{" "}
          <Link
            href="https://wa.me/918696963496"
            className="font-bold text-blue-600 hover:text-blue-800 underline"
          >
            +91-8696963496
          </Link>{" "}
          your order for{" "}
          <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "}
          delivery. Our customer care is available from 8:00 AM to 10:00 PM, all
          days.
        </p>
      </div>
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
