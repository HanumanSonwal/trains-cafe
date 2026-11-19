import React, { memo, useCallback, useMemo } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import Image from "next/image";
import { trackAddToCart, trackRemoveFromCart } from "@/app/lib/analytics";

// A steady 3.8 - 4.9 rating per item (from its id), so it never jumps on re-render.
const ratingFor = (id) => {
  let h = 0;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (3.8 + (h % 12) / 10).toFixed(1);
};

// Zomato-style veg / non-veg mark
function FoodMark({ type }) {
  const veg = !/non/i.test(type || "");
  const color = veg ? "border-green-600 text-green-600" : "border-red-600 text-red-600";
  return (
    <span
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border-[1.5px] ${color}`}
      aria-hidden="true"
    >
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

// ADD button / quantity stepper. One fixed size so the card never shifts when it changes.
function CartControl({ item, quantity, onAdd, onChange }) {
  if (quantity > 0) {
    return (
      <div
        role="group"
        aria-label={`${item.name} quantity`}
        className="flex h-9 w-24 items-center justify-between overflow-hidden rounded-lg bg-[#D6872A] text-white shadow-md"
      >
        <button
          type="button"
          aria-label={`Remove one ${item.name}`}
          onClick={() => onChange(item, quantity - 1, quantity)}
          className="grid h-full w-8 place-items-center text-[13px] transition active:bg-[#704D25]"
        >
          <MinusOutlined />
        </button>
        <span className="text-sm font-bold tabular-nums" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          aria-label={`Add one more ${item.name}`}
          onClick={() => onChange(item, quantity + 1, quantity)}
          className="grid h-full w-8 place-items-center text-[13px] transition active:bg-[#704D25]"
        >
          <PlusOutlined />
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      aria-label={`Add ${item.name} to cart`}
      onClick={() => onAdd(item)}
      className="relative h-9 w-24 rounded-lg border border-[#D6872A]/50 bg-white text-sm font-bold uppercase tracking-wide text-[#D6872A] shadow-md transition active:scale-95 active:bg-[#faf3ea]"
    >
      Add
      <PlusOutlined className="absolute right-1.5 top-1 text-[9px]" />
    </button>
  );
}

// Re-renders only when its own item or quantity changes, not on every cart update.
const MenuItem = memo(function MenuItem({ item, quantity, onAdd, onChange }) {
  // The cart and the bill use Final_Price (falling back to price), so show the same number.
  const price = Number(item.price) || 0;
  const discounted =
    item.Final_Price ?? (item.discount ? Math.floor(price - price * (item.discount / 100)) : price);

  return (
    <article className="flex gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FoodMark type={item.foodType} />
          <span className="truncate">{item.foodType}</span>
        </div>

        {/* the site forces h1-h4 sizes with !important, so a heading role keeps the size */}
        <p role="heading" aria-level={3} className="mt-1 text-[16px] font-semibold leading-snug text-gray-900">
          {item.name}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-green-600 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
            {ratingFor(item._id)} ★
          </span>
          {item.discount > 0 && (
            <span className="text-[11px] font-semibold text-[#704D25]">{item.discount}% OFF</span>
          )}
        </div>

        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-gray-500">{item.description}</p>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-2.5">
          <span className="text-base font-bold text-gray-900">₹{discounted}</span>
          {discounted < price && <span className="text-xs text-gray-400 line-through">₹{price}</span>}
        </div>
      </div>

      <div className="flex w-28 shrink-0 flex-col items-center">
        <Image
          src={item.image}
          alt={item.name}
          width={112}
          height={112}
          sizes="112px"
          className="h-28 w-28 rounded-xl bg-gray-50 object-cover"
        />
        <div className="relative z-10 -mt-[18px]">
          <CartControl item={item} quantity={quantity} onAdd={onAdd} onChange={onChange} />
        </div>
      </div>
    </article>
  );
});

const MenuItems = memo(({ items }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // one pass over the cart instead of a find() per item per render
  const quantities = useMemo(() => {
    const map = new Map();
    for (const c of cartItems) map.set(c._id, c.quantity);
    return map;
  }, [cartItems]);

  const handleAdd = useCallback(
    (item) => {
      dispatch(addItemToCart({ ...item }));
      trackAddToCart(item);
    },
    [dispatch]
  );
  const handleChange = useCallback(
    (item, quantity, previous) => {
      dispatch(updateItemQuantity({ id: item._id, quantity: Math.max(0, quantity) }));
      (quantity > previous ? trackAddToCart : trackRemoveFromCart)(item);
    },
    [dispatch]
  );

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <MenuItem
          key={item._id}
          item={item}
          quantity={quantities.get(item._id) || 0}
          onAdd={handleAdd}
          onChange={handleChange}
        />
      ))}
    </div>
  );
});

MenuItems.displayName = "MenuItems";
export default MenuItems;
