"use client";

import React, { useState } from "react";
import { Select, Switch, Button, InputNumber, Badge } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { addItemToCart, removeItemFromCart } from "@/app/redux/cartSlice";
import { menuItems } from "@/app/redux/menuItems";

const { Option } = Select;

const MenuPage = () => {
  const [isVegCategory, setIsVegCategory] = useState(true);
  const [activeCategory, setActiveCategory] = useState("RECOMMENDED");

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const cartItemCount = Object.values(cartItems).reduce(
    (total, count) => total + count,
    0
  );
  const totalPrice = menuItems.reduce(
    (total, item) => total + (cartItems[item.id] || 0) * item.price,
    0
  );

  const menuCategories = [
    { key: "RECOMMENDED", label: "Recommended" },
    { key: "THALI", label: "Thali" },
    { key: "SNACKS", label: "Snacks" },
    { key: "COMBO", label: "Combo" },
    { key: "BIRYANI", label: "Biryani" },
    { key: "RICE", label: "Rice" },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.category === activeCategory && item.veg === isVegCategory
  );

  const handleAddToCart = (item) => {
    dispatch(addItemToCart({ id: item.id }));
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeItemFromCart({ id: item.id }));
  };

  const handleCategoryToggle = (checked) => {
    setIsVegCategory(checked);
  };

  return (
    <div className="max-w-[575px] mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#704D25]">
        Ordering Food at <span className="text-[#d6872a]">Jaipur</span>
      </h1>

      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span
              className={`mr-2 ${
                isVegCategory ? "text-grey-600" : "text-grey-600"
              }`}
            >
              {isVegCategory ? "VEG" : "NON-VEG"}
            </span>
            <Switch
              checked={isVegCategory}
              onChange={handleCategoryToggle}
              checkedChildren="VEG"
              unCheckedChildren="NON-VEG"
              className={isVegCategory ? "bg-grey-600" : "bg-grey-600"}
            />
          </div>
        </div>

        <Select
          value={activeCategory}
          onChange={setActiveCategory}
          className="w-full"
          style={{ width: "100%" }}
        >
          {menuCategories.map((category) => (
            <Option key={category.key} value={category.key}>
              {category.label}
            </Option>
          ))}
        </Select>
      </div>

      {filteredMenuItems.length > 0 ? (
        filteredMenuItems.map((item) => (
          <div key={item.id} className="bg-white shadow rounded-lg mb-4 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-[#d6872a]">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-1">₹ {item.price}</p>
              </div>
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <p className="text-xs text-green-500 mb-2">{item.availability}</p>
            <div className="flex justify-end items-center">
              {cartItems[item.id] ? (
                <div className="flex items-center">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => handleRemoveFromCart(item)}
                    className="border-green-500 text-green-500"
                  />
                  <InputNumber
                    min={0}
                    max={10}
                    value={cartItems[item.id]}
                    className="mx-2 w-12 text-center"
                    readOnly
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleAddToCart(item)}
                    className="border-green-500 text-green-500"
                  />
                </div>
              ) : (
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  ADD +
                </Button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">
          No items available in this category.
        </p>
      )}

      <div className="flex items-center justify-between space-x-4 mt-6">
        <Link href="/cart">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Badge count={cartItemCount} showZero={true}>
              <ShoppingCartOutlined style={{ fontSize: "24px" }} />
            </Badge>
            <span>{cartItemCount} Item(s) in cart</span>
            <span className="text-gray-500">
              ({`₹${totalPrice.toFixed(2)}`})
            </span>
          </div>
        </Link>
        <Link href="/cart">
          <Button
            type="primary"
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
            className="w-full text-white py-3 text-lg font-semibold rounded-md"
          >
            View Cart{" "}
            <ArrowRightOutlined style={{ color: "white", marginLeft: "8px" }} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;
