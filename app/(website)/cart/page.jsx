"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import { useRouter } from "next/navigation";
import RecentOrders from "@/app/componants/RecentOrders";
import Image from "next/image";

const CartItem = React.memo(({ item, onIncrease, onDecrease }) => {
  const displayPrice = item.Final_Price ?? item.price;

  return (
    <div className="bg-white rounded-lg shadow p-2 flex justify-between items-center mb-2">
      <div className="flex-1 pr-3">
        <h3 className="font-semibold text-[#704D25] text-sm">{item.name}</h3>
        <p className="text-xs text-gray-500">{item.vendor || "Vendor N/A"}</p>
        <p className="text-xs text-gray-500">{item.foodType}</p>
        <p className="text-sm mt-1 font-semibold">
          ₹ {displayPrice.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center border border-[#D6872A] rounded-full overflow-hidden">
        <Button
          size="small"
          icon={<MinusOutlined />}
          onClick={() => onDecrease(item)}
          className="!border-0 !bg-[#D6872A] !text-white rounded-none hover:!bg-[#704D25] transition"
        />
        <div className="px-2 text-[#D6872A] font-bold text-sm">
          {item.quantity}
        </div>
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onIncrease(item)}
          className="!border-0 !bg-[#D6872A] !text-white rounded-none hover:!bg-[#704D25] transition"
        />
      </div>
    </div>
  );
});

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + (item.Final_Price ?? item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  const handleProceedToCheckout = useCallback(() => {
    router.push("/checkout");
  }, [router]);

  const handleIncreaseQuantity = useCallback(
    (item) => {
      dispatch(addItemToCart({ ...item }));
    },
    [dispatch]
  );

  const handleDecreaseQuantity = useCallback(
    (item) => {
      const currentQuantity =
        cartItems.find((cartItem) => cartItem._id === item._id)?.quantity || 0;

      if (currentQuantity > 1) {
        dispatch(
          updateItemQuantity({ id: item._id, quantity: currentQuantity - 1 })
        );
      } else if (currentQuantity === 1) {
        setItemToRemove(item);
        setModalOpen(true);
      }
    },
    [dispatch, cartItems]
  );

  const handleConfirmRemove = useCallback(() => {
    if (itemToRemove) {
      dispatch(updateItemQuantity({ id: itemToRemove._id, quantity: 0 }));
    }
    setModalOpen(false);
    setItemToRemove(null);
  }, [dispatch, itemToRemove]);

  const handleCancelRemove = useCallback(() => {
    setModalOpen(false);
    setItemToRemove(null);
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-4 pb-28 bg-[#f9f9f9] min-h-screen">
      <div className="relative h-36 md:h-48 mb-5 rounded-xl overflow-hidden shadow">
        <Image
          src="/images/Trainscafe-Banner.webp"
          alt="Online Food Delivery in Train"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold">
            Your Cart
          </h1>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
            />
          ))}

          <div className="bg-white rounded-lg shadow p-3 flex justify-between items-center mt-3">
            <span className="font-semibold text-gray-600 text-sm">Total:</span>
            <span className="font-bold text-[#704D25] text-lg">
              ₹ {totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              type="primary"
              style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
              className="w-full sm:w-1/2 text-white py-2 text-base font-semibold rounded-md"
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
