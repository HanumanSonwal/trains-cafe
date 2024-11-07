"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

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
      if (window.confirm("Do you want to remove this item from the cart?")) {
        dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
      }
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + parseInt(item.price, 10) * parseInt(item.quantity, 10);
  }, 0);

  return (
    <div className="max-w-[1024px] mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">
        Your <span style={{ color: "#704d25" }}>Cart</span>
      </h1>

      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => {
            return (
              <div
                key={item._id}
                className="bg-white flex flex-col sm:flex-row justify-between shadow rounded-lg mb-4 p-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2 w-full">
                  <Image
                    width={64}
                    height={64}
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mb-2 sm:mb-0 sm:mr-4"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-[#704D25]">
                      {item.name}
                    </h3>
                    <div className="text-gray-700 text-md font-bold">
                      ₹{" "}
                      {(
                        parseInt(item.price, 10) * parseInt(item.quantity, 10)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end items-center mt-2 sm:mt-0">
                  <div className="flex items-center">
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleDecreaseQuantity(item)}
                      className="border-blue-500 text-blue-500 mr-2"
                    />
                    <span className="text-gray-700 text-lg mx-2">
                      {item.quantity}
                    </span>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleIncreaseQuantity(item)}
                      className="border-blue-500 text-blue-500 ml-2"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between items-center mt-6 mb-4 px-4 sm:px-0">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-xl font-bold text-gray-800">
              ₹ {totalPrice.toFixed(2)}
            </span>
          </div>
          <Button
            type="primary"
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
            className="w-full sm:w-1/2 lg:w-1/3 text-white py-3 text-lg font-semibold rounded-md mx-auto"
            onClick={handleProceedToCheckout}
          >
            Proceed
          </Button>
        </>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
