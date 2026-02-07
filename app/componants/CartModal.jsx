"use client";

import { Modal, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { DeleteFilled } from "@ant-design/icons";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  addItemToCart,
  updateItemQuantity,
} from "@/app/redux/cartSlice";
import { useMemo, useCallback } from "react";

export default function CartModal({ onClose }) {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items,
    shallowEqual
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const increase = useCallback(
    (item) => dispatch(addItemToCart(item)),
    [dispatch]
  );

  const decrease = useCallback(
    (item) => {
      dispatch(
        updateItemQuantity({
          id: item._id,
          quantity: item.quantity - 1,
        })
      );
    },
    [dispatch]
  );

  const remove = useCallback(
    (item) => {
      dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
    },
    [dispatch]
  );

  return (
    <Modal
      title="Cart Items"
      open
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={400}
    >
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center py-4 border-b"
            >
              <div className="flex gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm">₹{item.price}</p>
                  <p className="text-sm font-bold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="small" onClick={() => decrease(item)}>
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button size="small" onClick={() => increase(item)}>
                  +
                </Button>
                <Button
                  danger
                  icon={<DeleteFilled />}
                  onClick={() => remove(item)}
                />
              </div>
            </div>
          ))}

          <div className="mt-4 font-bold text-lg">
            Total: ₹{totalPrice.toFixed(2)}
          </div>

          <div className="flex gap-2 mt-4">
            <Link href="/cart" className="w-full">
              <Button block onClick={onClose}>
                Go to Cart
              </Button>
            </Link>
            <Link href="/checkout" className="w-full">
              <Button block onClick={onClose}>
                Checkout
              </Button>
            </Link>
          </div>
        </>
      )}
    </Modal>
  );
}
