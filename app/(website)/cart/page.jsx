"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import { useRouter } from "next/navigation";
import RecentOrders from "@/app/componants/RecentOrders";
import Image from "next/image";

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

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.finalPrice * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-2xl p-4 pb-28 bg-[#f9f9f9] min-h-screen">
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

      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow p-3 flex justify-between items-center mb-3"
            >
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-[#704D25]">{item.name}</h3>
                <p className="text-xs text-gray-500">
                  {item.vendor || "Vendor N/A"}
                </p>
                <p className="text-xs text-gray-500">{item.foodType}</p>
                {item.discount > 0 ? (
                  <p className="text-sm mt-1">
                    <span className="line-through text-gray-400 mr-1">
                      ₹ {item.price.toFixed(2)}
                    </span>
                    <span className="text-[#D6872A] font-semibold">
                      ₹ {item.finalPrice.toFixed(2)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm mt-1 font-semibold">
                    ₹ {item.finalPrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex items-center border border-[#D6872A] rounded-full overflow-hidden">
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => handleDecreaseQuantity(item)}
                  className="!border-0 !bg-[#D6872A] !text-white rounded-none hover:!bg-[#704D25] transition"
                />
                <div className="px-3 text-[#D6872A] font-bold">
                  {item.quantity}
                </div>
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => handleIncreaseQuantity(item)}
                  className="!border-0 !bg-[#D6872A] !text-white rounded-none hover:!bg-[#704D25] transition"
                />
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg shadow p-3 flex justify-between items-center mt-4">
            <span className="font-semibold text-gray-600">Total:</span>
            <span className="font-bold text-[#704D25] text-lg">
              ₹ {totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              type="primary"
              style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
              className="w-full sm:w-1/2 text-white py-2 text-lg font-semibold rounded-md"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>
      )}

      <div className="mt-8">
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
