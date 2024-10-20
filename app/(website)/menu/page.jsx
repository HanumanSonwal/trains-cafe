"use client";

import React, { useEffect, useState } from "react";
import { Collapse, Button, InputNumber, Badge, Switch } from "antd";
import {
  ArrowRightOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import { menuItems } from "@/app/redux/menuItems";
import { useSearchParams } from "next/navigation";
import { getVendorCategoriesAndMenuItems } from "@/services/vendors";
import Image from "next/image";

const { Panel } = Collapse;

const MenuPage = () => {
  const [isVegCategory, setIsVegCategory] = useState(true);
  const [categories, setCategories] = useState([]);
  const cartItems = useSelector((state) => state.cart.items);
  const totalUniqueItems = cartItems.length;
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      parseInt(item?.quantity || 0, 10) * parseInt(item?.price || 0, 10),
    0
  );

  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");

  useEffect(() => {
    const getVendorMenus = async () => {
      const response = await getVendorCategoriesAndMenuItems(
        vendorId,
        isVegCategory
      );
      if (response && response.length > 0) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    };

    getVendorMenus();
  }, [vendorId, isVegCategory]);

  const handleCategoryToggle = (checked) => {
    setIsVegCategory(checked);
  };

  return (
    <div className="max-w-[575px] mx-auto p-4 bg-gray-100 min-h-screen">
      {/* Header showing selected station and vendor */}
      <h1 className="text-2xl font-bold mb-6 text-center text-[#704D25]">
        Ordering Food at{" "}
        <span className="text-[#d6872a]">
          {categories.length > 0 ? categories[0].station : "N/A"}
        </span>
      </h1>

      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="flex justify-between items-center my-5">
          <div>
            <h2 className="text-lg font-bold">
              {categories.length > 0 ? categories[0].vendor : "N/A"}
            </h2>
            <p className="text-gray-500">Pure Veg | Min Order ₹99 | 30 MIN</p>
          </div>
          <div>
            {/* <span className="text-grey-600">{isVegCategory ? "VEG" : "NON-VEG"}</span> */}
            <Switch
              checked={isVegCategory}
              onChange={handleCategoryToggle}
              checkedChildren="VEG"
              unCheckedChildren="NON-VEG"
            />
          </div>
        </div>
      </div>

      {/* Accordion for Menu Categories */}
      <Collapse accordion>
        {categories.map((category, idx) => (
          <Panel header={category.categoryName} key={category.categoryName}>
            <div className="max-h-[400px] overflow-y-auto">
              {category.items.length > 0 ? (
                category.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white shadow rounded-lg mb-4 p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-[#d6872a]">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          ₹ {item.price}
                        </p>
                      </div>
                      <Image
                        width={80}
                        height={80}
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-green-500 mb-2">
                      {item.availability}
                    </p>
                    <div className="flex justify-end items-center">
                      <CartComp cartItems={cartItems} item={item} key={idx} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No items available in this category.
                </p>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>

      {/* Cart Section */}
      <div className="flex items-center justify-between space-x-4 mt-6">
        <Link href="/cart">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Badge count={totalUniqueItems} showZero={true}>
              <ShoppingCartOutlined style={{ fontSize: "24px" }} />
            </Badge>
            <span>{totalUniqueItems} Item(s) in cart</span>
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

const CartComp = ({ cartItems, item }) => {
  const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);

  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addItemToCart({ ...item }));
  };

  const handleRemoveFromCart = (item) => {
    const currentQuantity = cartItem.quantity;
    if (currentQuantity > 1) {
      dispatch(
        updateItemQuantity({ id: item._id, quantity: currentQuantity - 1 })
      );
    } else {
      dispatch(updateItemQuantity({ id: item._id, quantity: 0 })); // This will remove the item
    }
  };

  return cartItem ? (
    <div className="flex items-center">
      <Button
        icon={<MinusOutlined />}
        onClick={() => handleRemoveFromCart(item)}
        className="border-green-500 text-green-500"
      />
      <InputNumber
        min={0}
        max={10}
        value={cartItem.quantity}
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
  );
};

export default MenuPage;
