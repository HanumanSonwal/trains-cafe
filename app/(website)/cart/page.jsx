"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RecentOrders from "@/app/componants/RecentOrders";

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(addItemToCart({ ...item }));
  };

  const handleDecreaseQuantity = (item) => {
    const currentQuantity = cartItems.find(
      (cartItem) => cartItem._id === item._id
    ).quantity;

    if (currentQuantity > 1) {
      dispatch(
        updateItemQuantity({ id: item._id, quantity: currentQuantity - 1 })
      );
    } else if (currentQuantity === 1) {
      setItemToRemove(item);
      setModalOpen(true);
    }
  };

  const handleConfirmRemove = () => {
    dispatch(updateItemQuantity({ id: itemToRemove._id, quantity: 0 }));
    setModalOpen(false);
    setItemToRemove(null);
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setItemToRemove(null);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + parseInt(item.price, 10) * parseInt(item.quantity, 10);
  }, 0);

  return (
 <div className="max-w-[1024px] mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="relative h-60 md:h-80">
        <img
          src="/images/section-bg.webp"
          alt="Banner"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-xl md:text-4xl font-bold text-center px-4">
            Cart
          </h1>
        </div>
      </div>
      <h1 className="text-xl md:text-2xl font-bold my-6 text-center">
        Your <span style={{ color: "#704d25" }}>Cart</span>
      </h1>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white flex flex-col sm:flex-row justify-between shadow rounded-lg mb-4 p-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center w-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mb-2 sm:mb-0 sm:mr-4"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-[#704D25]">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-md font-medium">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-gray-700 text-md font-bold">
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end items-center mt-4 sm:mt-0">
                <div className="flex items-center">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => handleDecreaseQuantity(item)}
                    className="border-coffee-500 text-coffee-600 hover:bg-coffee-500 hover:text-white"
                  />
                  <span className="text-gray-700 text-lg mx-2">
                    {item.quantity}
                  </span>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleIncreaseQuantity(item)}
                    className="border-coffee-500 text-coffee-600 hover:bg-coffee-500 hover:text-white"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 mb-4 px-4 sm:px-0">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-xl font-bold text-gray-800">
              ₹ {totalPrice.toFixed(2)}
            </span>
          </div>
          <Button
            type="primary"
            style={{
              backgroundColor: "#D6872A",
              borderColor: "#D6872A",
            }}
            className="w-full sm:w-1/2 lg:w-1/3 text-white py-3 text-lg font-semibold rounded-md mx-auto"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        </>
      ) : (
        <p className="text-center text-gray-600 mt-6">Your cart is empty.</p>
      )}

      <div className="mt-10">
        <RecentOrders />
      </div>

      <Modal
        title="Confirm Removal"
        visible={isModalOpen}
        onOk={handleConfirmRemove}
        onCancel={handleCancelRemove}
        okText="Remove"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Do you want to remove this item from the cart?</p>
      </Modal>
    </div>
  );
};

export default CartPage;
