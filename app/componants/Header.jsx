"use client";

import { useState } from "react";
import { ShoppingCartOutlined, DeleteFilled } from "@ant-design/icons";
import { Badge, Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import RegisterServiceWorker from "./registerServiceWorker";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();

  const cartItemsRaw = useSelector((state) => state.cart.items);
  const cartItems = Array.isArray(cartItemsRaw) ? cartItemsRaw : [];

  const totalUniqueItems = cartItems.length;
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const handleClose = () => setIsCartOpen(false);

  const handleIncreaseQuantity = (item) => {
    dispatch(addItemToCart(item));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateItemQuantity({ id: item._id, quantity: item.quantity - 1 })
      );
    } else {
      Modal.confirm({
        title: "Remove Item",
        content: "Do you want to remove this item from the cart?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
        },
      });
    }
  };

  const handleDeleteItem = (item) => {
    Modal.confirm({
      title: "Delete Item",
      content: "Are you sure you want to delete this item?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
      },
    });
  };

  return (
    <div className="sticky top-0 z-50 mx-auto">
      <header className="relative flex flex-col items-center p-4 bg-white shadow-md">
        <div className="flex justify-between items-center w-full">
          <Link href="/">
            <img src="/images/logo.svg" alt="Logo" className="h-10" />
          </Link>

          <RegisterServiceWorker />

          <div className="flex items-center gap-4">
            <button className="cart-button" onClick={toggleCart}>
              <Badge count={totalUniqueItems} showZero>
                <ShoppingCartOutlined style={{ fontSize: "24px" }} />
              </Badge>
            </button>
          </div>
        </div>
      </header>

      <Modal
        title="Cart Items"
        open={isCartOpen}
        onCancel={handleClose}
        footer={null}
        width={400}
      >
        <ul>
          {totalUniqueItems > 0 ? (
            cartItems.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center py-4 border-b border-gray-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div className="flex flex-col">
                    <span
                      className="font-semibold"
                      style={{ color: "#6F4D27" }}
                    >
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">₹{item.price}</span>
                    <span className="text-sm text-gray-500 font-bold">
                      Total: ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    style={{
                      backgroundColor: "#FAF3CC",
                      borderColor: "#D6872A",
                      color: "#6F4D27",
                    }}
                    onClick={() => handleDecreaseQuantity(item)}
                    className="rounded-full w-8 h-8 flex justify-center items-center transition-all duration-300 transform hover:scale-110"
                    size="small"
                  >
                    -
                  </Button>

                  <span className="mx-2 font-semibold">{item.quantity}</span>

                  <Button
                    style={{
                      backgroundColor: "#FAF3CC",
                      borderColor: "#D6872A",
                      color: "#6F4D27",
                    }}
                    onClick={() => handleIncreaseQuantity(item)}
                    className="rounded-full w-8 h-8 flex justify-center items-center transition-all duration-300 transform hover:scale-110"
                    size="small"
                  >
                    +
                  </Button>

                  <Button
                    onClick={() => handleDeleteItem(item)}
                    icon={<DeleteFilled />}
                    danger
                  />
                </div>
              </li>
            ))
          ) : (
            <p>No items in the cart.</p>
          )}
        </ul>

        {totalUniqueItems > 0 && (
          <div className="mt-4">
            <span className="text-xl font-bold">
              Total: ₹ {totalPrice.toFixed(2)}
            </span>

            <div className="flex justify-between mt-4">
              <Link href="/cart">
                <Button
                  type="primary"
                  className="w-full mr-2"
                  onClick={handleClose}
                  style={{
                    backgroundColor: "#FAF3CC",
                    borderColor: "#D6872A",
                    color: "#6F4D27",
                  }}
                >
                  Go to Cart
                </Button>
              </Link>

              <Link href="/checkout">
                <Button
                  type="primary"
                  className="w-full"
                  onClick={handleClose}
                  style={{
                    backgroundColor: "#FAF3CC",
                    borderColor: "#D6872A",
                    color: "#6F4D27",
                  }}
                >
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
