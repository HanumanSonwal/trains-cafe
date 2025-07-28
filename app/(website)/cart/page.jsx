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
    <div className="mx-auto max-w-3xl p-4 pb-28 bg-[#f9f9f9] min-h-screen">
      {/* Banner */}
      <div className="relative h-40 md:h-56 mb-6 rounded-xl overflow-hidden shadow">
        <Image
          src="/images/Trainscafe-Banner.webp"
          alt="Online Food Delivery in Train"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold">
            Your Cart
          </h1>
        </div>
      </div>

      {/* Cart Items */}
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
          <div
  key={item._id}
  className="bg-white shadow hover:shadow-lg transition rounded-xl flex justify-between items-center gap-4 mb-4 p-4"
>
  {/* Left: Image & Details */}
  <div className="flex items-center gap-4 flex-1">
    <div className="w-24 h-24 relative flex-shrink-0 rounded-lg overflow-hidden">
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-lg font-bold text-[#704D25]">{item.name}</h3>
      <p className="text-xs text-gray-500 mb-1">{item.description}</p>
      <p className="text-xs text-gray-500 mb-1">
        Vendor:{" "}
        <span className="font-medium text-[#D6872A]">
          {item.vendor || "N/A"}
        </span>
      </p>
      <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
        {item.foodType}
      </span>
      <p className="mt-2 font-bold text-lg text-gray-800">
        ₹ {(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>

  {/* Right: Quantity Controls */}
  <div className="flex items-center gap-3">
    <Button
      size="small"
      shape="circle"
      icon={<MinusOutlined />}
      onClick={() => handleDecreaseQuantity(item)}
      className="border border-gray-300 hover:border-[#D6872A] text-gray-700 hover:text-white hover:bg-[#D6872A] transition"
    />
    <span className="text-lg font-medium">{item.quantity}</span>
    <Button
      size="small"
      shape="circle"
      icon={<PlusOutlined />}
      onClick={() => handleIncreaseQuantity(item)}
      className="border border-gray-300 hover:border-[#D6872A] text-gray-700 hover:text-white hover:bg-[#D6872A] transition"
    />
  </div>
</div>

          ))}

          <div className="bg-white shadow rounded-xl p-4 flex justify-between items-center my-6">
            <span className="text-lg font-semibold text-gray-600">Total:</span>
            <span className="text-2xl font-bold text-[#704D25]">
              ₹ {totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Sticky Checkout Button */}
           <div className="flex justify-center">
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
           </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>
      )}

      <div className="mt-10">
        <RecentOrders />
      </div>

      <Modal
        title="Confirm Removal"
        open={isModalOpen}
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
