"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useSelector, shallowEqual } from "react-redux";
import Link from "next/link";
import dynamic from "next/dynamic";
import RegisterServiceWorker from "./registerServiceWorker";

const CartModal = dynamic(() => import("./CartModal"), {
  ssr: false,
});

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = useSelector(
    (state) => state.cart.items.length,
    shallowEqual
  );

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  return (
    <div className="sticky top-0 z-50 mx-auto bg-white shadow-md">
      <header className="flex justify-between items-center p-4 max-w-[575px] mx-auto">
        {/* LEFT: LOGO */}
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={120}
            height={40}
            unoptimized
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* CENTER: DOWNLOAD / INSTALL BUTTON */}
        <div className="flex-1 flex justify-center">
          <RegisterServiceWorker />
        </div>

        {/* RIGHT: CART */}
        <button onClick={openCart} className="cart-button">
          <Badge count={cartCount} showZero>
            <ShoppingCartOutlined style={{ fontSize: 24 }} />
          </Badge>
        </button>
      </header>

      {isCartOpen && <CartModal onClose={closeCart} />}
    </div>
  );
}
