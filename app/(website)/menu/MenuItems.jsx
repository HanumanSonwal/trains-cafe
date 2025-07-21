import React, { memo, useMemo } from "react";
import { Button, Rate } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import Image from "next/image";

const MenuItems = memo(({ items }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // ✅ Stable random ratings only once
  const ratingsMap = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      map[item._id] = (Math.random() * (5 - 3.8) + 3.8).toFixed(1);
    });
    return map;
  }, [items]);

  const handleAdd = (item) => {
    dispatch(addItemToCart({ ...item }));
  };

  const handleIncrement = (item) => {
    const current = cartItems.find((c) => c._id === item._id);
    dispatch(
      updateItemQuantity({ id: item._id, quantity: current.quantity + 1 })
    );
  };

  const handleDecrement = (item) => {
    const current = cartItems.find((c) => c._id === item._id);
    if (current.quantity > 1) {
      dispatch(
        updateItemQuantity({ id: item._id, quantity: current.quantity - 1 })
      );
    } else {
      dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const discountedPrice = item.discount
          ? Math.floor(item.price - item.price * (item.discount / 100))
          : item.price;

        const cartItem = cartItems.find((c) => c._id === item._id);

        const randomRating = ratingsMap[item._id];

        return (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow border px-4 py-3 flex"
          >
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden mr-4">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center text-xs text-green-600 mb-1">
                  🟢 {item.foodType}
                </div>

                <h3 className="text-base font-semibold text-[#333] mb-1">
                  {item.name}
                </h3>

                <p className="text-xs text-gray-500 mb-1">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 mb-1">
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={Number(randomRating)}
                    style={{ fontSize: "14px" }}
                  />
                  <span className="text-xs text-gray-500">{randomRating}</span>
                </div>

                {item.discount > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg text-orange-700 px-2 py-1 text-xs inline-block">
                    {item.discount}% OFF
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div>
                  {item.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-xs text-gray-400">
                        ₹{item.price}
                      </span>
                      <span className="text-base font-semibold text-green-600">
                        ₹{discountedPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-semibold text-black">
                      ₹{item.price}
                    </span>
                  )}
                </div>

                {cartItem && cartItem.quantity > 0 ? (
                  <div className="flex items-center border border-red-500 rounded-full overflow-hidden">
                    <Button
                      icon={<MinusOutlined />}
                      size="small"
                      onClick={() => handleDecrement(item)}
                      className="!border-0 !bg-red-500 !text-white rounded-none"
                    />
                    <div className="px-3 text-red-600 font-bold">
                      {cartItem.quantity}
                    </div>
                    <Button
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => handleIncrement(item)}
                      className="!border-0 !bg-red-500 !text-white rounded-none"
                    />
                  </div>
                ) : (
                  <Button
                    icon={<PlusOutlined />}
                    size="small"
                    className="border border-red-500 text-red-500 font-bold rounded-full"
                    onClick={() => handleAdd(item)}
                  >
                    ADD
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

MenuItems.displayName = "MenuItems";
export default MenuItems;
