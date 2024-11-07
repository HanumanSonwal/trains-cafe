"use client";

import React, { useEffect, useState } from "react";
import {
  Collapse,
  Button,
  InputNumber,
  Badge,
  Switch,
  Modal,
  Spin,
} from "antd";
import {
  ArrowRightOutlined,
  LoadingOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import { useSearchParams } from "next/navigation";
import { getVendorCategoriesAndMenuItems } from "@/services/vendors";
import Image from "next/image";

const { Panel } = Collapse;

const MenuPage = () => {
  const [isVegCategory, setIsVegCategory] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector((state) => state.cart.items);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalUniqueItems = cartItems.length;

  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");

  useEffect(() => {
    const getVendorMenus = async () => {
      setLoading(true);
      const response = await getVendorCategoriesAndMenuItems(
        vendorId,
        isVegCategory
      );
      setCategories(response || []);
      setLoading(false);
    };

    getVendorMenus();
  }, [vendorId, isVegCategory]);

  const handleCategoryToggle = (checked) => {
    setIsVegCategory(checked);
  };

  const handleReadMore = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 48, color: "#D6872A" }} spin />
  );

  return (
    <div className="max-w-[575px] mx-auto p-4 bg-gray-100 ">
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
          <Switch
            checked={isVegCategory}
            onChange={handleCategoryToggle}
            checkedChildren="VEG"
            unCheckedChildren="NON-VEG"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center ">
          <Spin indicator={antIcon} />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-600">
          No menu available for this vendor.
        </p>
      ) : (
        <Collapse accordion>
          {categories.map((category) => (
            <Panel header={category.categoryName} key={category.categoryName}>
              <div className="max-h-[400px] overflow-y-auto">
                {category.items.length > 0 ? (
                  category.items.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white shadow rounded-lg mb-4 p-4"
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                      <Image
                          width={80}
                          height={80}
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="w-3/4">
                          <h3 className="text-lg font-semibold text-[#d6872a]">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description.split(" ").slice(0, 8).join(" ")}
                            ...
                            <br />
                            <button
                              onClick={() => handleReadMore(item)}
                              className="text-[#d6872a] underline"
                            >
                              View Details
                            </button>
                          </p>
                          <div className="flex gap-2 items-center">
                            {/* Discount Tag */}
                            {item.discount > 0 && (
                              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                {item.discount}% OFF
                              </span>
                            )}
                            {/* Food Type (Veg, Non-Veg, or Both) */}
                            <div className="flex space-x-1">
                              {item.foodType === "Vegetarian" && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  V
                                </span>
                              )}
                              {item.foodType === "Non-Vegetarian" && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  N
                                </span>
                              )}
                              {item.foodType === "Both" && (
                                <>
                                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    V
                                  </span>
                                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    N
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      
                      </div>
                      <p className="text-xs text-green-500 mb-2">
                        {item.availability}
                      </p>
                      <div className="flex justify-between items-center">
                        <p
                          style={{ color: "#704d25", fontWeight: "bold" }}
                          className="text-lg mb-1"
                        >
                          ₹ {item.price}
                        </p>
                        <CartComp cartItems={cartItems} item={item} />
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
      )}

      {/* Go to Cart Button with Quantity Badge */}
      {/* Go to Cart Button with Quantity Badge */}
      <div className="flex items-center justify-between mt-6 w-full">
        <Badge count={totalUniqueItems} offset={[0, 0]}>
          <ShoppingCartOutlined className="text-2xl text-green-500" />
        </Badge>

        <Link href="/cart" passHref>
          <Button
            type="primary"
            style={{ backgroundColor: "#D6872A", color: "white" }}
            className="w-full  py-2 text-white hover:bg-opacity-90 flex items-center justify-center rounded-lg"
          >
            <span>Go to Cart</span>
            <ArrowRightOutlined className="ml-2" />
          </Button>
        </Link>
      </div>

      <Modal
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        className="max-w-[300px] mx-auto p-4 bg-white rounded-lg"
      >
        {selectedItem && (
          <div className="text-center">
            <Image
              width={100}
              height={100}
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-32 h-32 object-cover rounded mx-auto"
            />
            <h3 className="text-xl font-semibold text-[#d6872a] mt-4">
              {selectedItem.name}
            </h3>
            <p className="text-gray-600 my-4">{selectedItem.description}</p>
            <div className="flex justify-between items-center">
              <p
                style={{ color: "#704d25", fontWeight: "bold" }}
                className="text-lg mb-1"
              >
                ₹ {selectedItem.price}
              </p>
              <CartComp cartItems={cartItems} item={selectedItem} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const CartComp = ({ cartItems, item }) => {
  const cartItem = Array.isArray(cartItems)
    ? cartItems.find((cartItem) => cartItem._id === item._id)
    : undefined;

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
      dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
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
