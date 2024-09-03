"use client";

import React, { useState } from "react";
import { Select, Switch, Button, InputNumber } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Option } = Select;

const MenuPage = () => {
  const [isVegCategory, setIsVegCategory] = useState(true);
  const [activeCategory, setActiveCategory] = useState("RECOMMENDED");
  const [cartItems, setCartItems] = useState({});

  const menuCategories = [
    { key: "RECOMMENDED", label: "Recommended" },
    { key: "THALI", label: "Thali" },
    { key: "SNACKS", label: "Snacks" },
    { key: "COMBO", label: "Combo" },
    { key: "BIRYANI", label: "Biryani" },
    { key: "RICE", label: "Rice" },
  ];

  const menuItems = [
    {
      id: 1,
      name: "VEG SPECIAL THALI",
      price: 246,
      description:
        "PANEER BUTTER MASALA,DAL FRY,3 BUTTER ROTI,RICE, SWEET,PICKLE,SALAD",
      availability: "Available from 07:30 AM to 11:30 PM.",
      image: "/images/special-veg-thali.jpg",
      category: "THALI",
      veg: true,
    },
    {
      id: 2,
      name: "CHICKEN BIRYANI",
      price: 350,
      description:
        "Aromatic basmati rice cooked with tender chicken pieces and flavorful spices, served with raita.",
      image: "/images/biryani.jpg",
      category: "BIRYANI",
      veg: false,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.category === activeCategory && item.veg === isVegCategory
  );

  const handleAddToCart = (item) => {
    setCartItems((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (item) => {
    setCartItems((prev) => {
      const newCount = (prev[item.id] || 0) - 1;
      const newCart = { ...prev };
      if (newCount <= 0) {
        delete newCart[item.id];
      } else {
        newCart[item.id] = newCount;
      }
      return newCart;
    });
  };

  const handleCategoryToggle = (checked) => {
    setIsVegCategory(checked);
  };

  return (
    <div className="max-w-[575px] mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Ordering Food at <span className="text-green-600">Jaipur</span>
      </h1>

      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          {/* <span className="font-semibold text-lg">Filter:</span> */}
          <div className="flex items-center">
            <span
              className={`mr-2 ${
                isVegCategory ? "text-green-600" : "text-red-600"
              }`}
            >
              {isVegCategory ? "VEG" : "NON-VEG"}
            </span>
            <Switch
              checked={isVegCategory}
              onChange={handleCategoryToggle}
              checkedChildren="VEG"
              unCheckedChildren="NON-VEG"
              className={isVegCategory ? "bg-green-500" : "bg-red-500"}
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
                <h3 className="text-lg font-semibold text-green-600">
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
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <p className="text-xs text-blue-500 mb-2">{item.availability}</p>
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
    </div>
  );
};

export default MenuPage;
