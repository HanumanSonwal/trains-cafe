"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

// Sticky "Your Order (n) · Subtotal · Continue" bar. It reads the cart itself, so a
// cart change re-renders only this bar, not the whole menu page.
export default function OrderBar() {
  const items = useSelector((state) => state.cart.items);

  const { count, subtotal } = useMemo(() => {
    let n = 0;
    let sum = 0;
    for (const i of items) {
      n += i.quantity;
      sum += (Number(i.Final_Price ?? i.price) || 0) * i.quantity; // same price rule as the cart
    }
    return { count: n, subtotal: Math.round(sum * 100) / 100 };
  }, [items]);

  if (!count) return null;

  return (
    // sits just above the 72px mobile footer
    <div className="fixed inset-x-0 bottom-[72px] z-50 mx-auto w-full max-w-[590px]">
      {/* dark brown so it stands out from the white menu behind it */}
      <div className="mx-2 mb-2 flex items-center justify-between gap-3 rounded-2xl bg-[#4a3319] px-4 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
        <div className="min-w-0">
          <p className="text-xs text-white/70">Your Order ({count})</p>
          <p className="truncate text-base font-bold text-white">
            Subtotal: ₹{subtotal.toLocaleString("en-IN")}
          </p>
        </div>
        <Link
          href="/cart"
          className="grid h-11 shrink-0 place-items-center rounded-xl bg-[#D6872A] px-7 text-[15px] font-semibold text-white transition active:scale-95 active:bg-[#b86f1c]"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
