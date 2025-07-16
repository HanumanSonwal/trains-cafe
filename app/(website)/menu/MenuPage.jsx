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
import RecentOrders from "@/app/componants/RecentOrders";

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
                      <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-4">
                        <Image
                          width={80}
                          height={80}
                          src={item.image}
                          alt={item.name}
                          className="w-full md:w-20 h-auto md:h-20 object-cover rounded"
                        />
                        <div className="flex-1">
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
                          <div className="flex flex-wrap gap-2 items-center">
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
      <RecentOrders />

      <div>
        <h2 className="font-bold"
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
          meal, <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong>{" "} at <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>{" "} station is ready to serve
          passengers traveling across India with a multiple varieties range of
          food.{" "}        
         
        </p>

         <h2 className="font-bold mb-2"
          style={{
            color: "#704d25",
            marginTop: "2rem",
          }}
        >
          Why Choose Trainscafe for  <Link
            className="font-bold text-blue-600 hover:text-blue-800 underline"
            href="https://www.trainscafe.in/online-train-food-delivery"
          >
            {" "}
           Online Train Food Delivery?{" "}
          </Link>

        </h2>
        <ul style={{ paddingLeft: "5%", listStyleType: "disc" }}>
                  <li>
                    <b>Expertise in Train Catering :</b> With years of experience in railway food delivery services, Trainscafe ensures every meal is prepared with care and delivered with precision.
                  </li>
                  <li>
                   <b>Trusted by Thousands :</b> Daily serving 500+ trains and thousands of passengers across major Indian railway  stations.
                  </li>
                   <li>
                   <b>Real-time Tracking & Support :</b> Know when your food is being prepared, dispatched, and delivered with real-time updates.
                  </li>
                  
                </ul>

                <div>
                  <h2 className="font-bold"
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
          Trainscafe has tied up with  <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong> to provide on-seat train food delivery at  <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>.
          <br />
          Whether you’re traveling alone or with family, or need group meal booking in train, Trainscafe ensures a smooth, satisfying food experience right at your berth.


        </p>
                </div>
                <div>
                  <h2 className="font-bold"
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
        <h4 className="py-2">Order your favorite food on train is just a few simple steps away</h4>
         <ul style={{ paddingLeft: "5%", listStyleType: "decimal" }}>
                  <li>
                   Visit <b>Trainscafe Web App</b> or use our  <b>Whatsapp</b>
                  </li>
                <li>Enter Train no. / station name or PNR number (e.g.,  <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>)
</li>
                  
                  <li>Choose <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong> from the list of available restaurants
</li>
<li>Select dishes from the displayed food menu
</li>
<li>Apply promo codes if available
</li>
<li>Pay online securely or choose <b>Cash on Delivery</b>
</li>
<li>Your food will be delivered directly to your train seat at  <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong> station</li>
                </ul>
                </div>
                
      </div>
      <div>
         <h2 className="font-bold"
          style={{
            marginTop: "2rem",
             color: "#704d25",
          }}
        >
          👨‍👩‍👧‍👦 Bulk Order Facility in Train

        </h2>
        <p className="py-2">
          Traveling in a group? Trainscafe provides bulk food ordering for group train journeys from  <strong>
            {categories.length > 0 ? categories[0].vendor : "N/A"}{" "}
          </strong> at  <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong>. Ideal for school trips, tour groups, and corporate teams,etc.
 ✅ Custom Menus | ✅ Best Prices | ✅ Timely Delivery | ✅ PAN-India Station Coverage
        </p>
        <h5 className="py-2 font-bold">Need Help with Your Train Food Order?</h5>
        <p className="py-2">Call us on <Link
                        href="tel:+918696963496"
                        className="font-bold text-blue-600 hover:text-blue-800 underline"
                      >
                        +91-8696963496
                      </Link>  or WhatsApp <Link
                        href="https://wa.me/918696963496"
                        className="font-bold text-blue-600 hover:text-blue-800 underline"
                      >
                        +91-8696963496
                      </Link>  your order for <strong>
            {categories.length > 0 ? categories[0].station : "N/A"}
          </strong> delivery. Our customer care is available from 8:00 AM to 10:00 PM, all days.
</p>
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