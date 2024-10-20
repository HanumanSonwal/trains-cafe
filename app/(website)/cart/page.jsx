"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Badge } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  addItemToCart,
  updateItemQuantity, // Updated this action
} from "@/app/redux/cartSlice";
import { menuItems } from "@/app/redux/menuItems";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Handle the proceed to checkout
  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  // Increase item quantity
  const handleIncreaseQuantity = (item) => {
    dispatch(addItemToCart({ ...item }));
  };

  // Decrease item quantity but prevent removing the product until the quantity is 0
  const handleDecreaseQuantity = (item) => {
    const currentQuantity = cartItems.find(
      (cartItem) => cartItem.id === item.id
    ).quantity;

    if (currentQuantity > 1) {
      dispatch(
        updateItemQuantity({ id: item._id, quantity: currentQuantity - 1 })
      );
    } else if (currentQuantity === 1) {
      // Confirm removal of product
      if (window.confirm("Do you want to remove this item from the cart?")) {
        dispatch(updateItemQuantity({ id: item._id, quantity: 0 })); // Quantity will be zero and item will be removed
      }
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + parseInt(item.price, 10) * parseInt(item.quantity, 10);
  }, 0);

  return (
    <div className="max-w-[575px] mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Your <span className="text-green-600">Cart</span>
      </h1>

      {Object.keys(cartItems).length > 0 ? (
        <>
          {cartItems.map((item) => {
            return (
              <div
                key={item._id}
                className="bg-white flex justify-between shadow rounded-lg mb-4 p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <Image
                    width={64}
                    height={64}
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <div className="text-gray-700 text-lg font-bold">
                      ₹{" "}
                      {(
                        parseInt(item.price, 10) * parseInt(item.quantity, 10)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleDecreaseQuantity(item)}
                      className="border-blue-500 text-blue-500 mr-2"
                    />
                    <span className="text-gray-700 text-lg">
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
          <div className="flex justify-between items-center mt-6 mb-4">
            <span className="text-xl font-bold text-gray-800">Total :</span>
            <span className="text-xl font-bold text-gray-800">
              ₹ {totalPrice.toFixed(2)}
            </span>
          </div>
          <Button
            type="primary"
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
            className="w-full text-white py-3 text-lg font-semibold rounded-md"
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
