import { Basket3, Cart, Trash } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutsideClickHandler from "~/components/ClickOutside";
import { removeFromCart, updateCart } from "~/redux/cart.slice";
import dynamic from "next/dynamic";
import { checkPercentage } from "~/lib/clientFunctions";
import { Close } from "@styled-icons/material";

const ImageLoader = dynamic(() => import("~/components/Image"));

export default function CartView() {
  const [showCart, setShowCart] = useState(false);
  const cart = useSelector((state) => state.cart);
  const [cartData, setCartData] = useState(cart);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const cartRef = useRef(null);
  const { session } = useSelector((state) => state.localSession);

  useEffect(() => {
    setCartData(cart);
  }, [cart]);

  useEffect(() => {
    if (cart.items && cart.items.length && cart) {
      cart.items.forEach((i) => {
        if (
          session &&
          session.user.accountType == "wholesaler" &&
          i.type == "variable"
        ) {
          dispatch(removeFromCart(i.uid));
        } else if (
          session &&
          session.user.accountType == "personal" &&
          i.type == "bulk"
        ) {
          dispatch(removeFromCart(i.uid));
        }
      });
    }
  }, [session, cart]);

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  // Getting the count of items
  console.log(cartData, "cccccc");
  const getItemsCount = () => {
    const p = cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty,
      0
    );
    return decimalBalance(p);
  };
  // Getting the total price with vat and tax of all items
  const getTotalPrice = () => {
    const p = cartData.items.reduce((accumulator, item) => {
      const totalPrice = item.qty * item.price;
      return (
        accumulator +
        totalPrice +
        checkPercentage(totalPrice, item.tax) +
        checkPercentage(totalPrice, item.vat)
      );
    }, 0);
    return decimalBalance(p);
  };

  function gotoCheckout() {
    router.push("/checkout");
  }

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setShowCart(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClickOutside = () => {
    setShowCart(false);
  };

  return (
    <div onClick={() => setShowCart(true)}>
      <div className="d-flex flex-column align-items-center">
        <div className={c.icon_div}>
          <Cart width={18} height={18} />
          {/* <span className={c.counter}>{getItemsCount()}</span> */}
          <span className={c.counter}>{cartData.items.length}</span>
        </div>
        <p className="text-uppercase m-0 mt-2 small ">{t("cart")}</p>
      </div>
      <OutsideClickHandler
        show={showCart}
        onClickOutside={() => setShowCart(!showCart)}
      >
        <div className={c.card}>
          {cartData.items && cartData.items.length === 0 ? (
            <div className={c.empty}>
              <Basket3 width={30} height={30} />
              <span>Your Cart is empty</span>
            </div>
          ) : (
            <>
              <div className={c.top_bar}>
                <span>Cart</span>
                <Close
                  onClick={() => setShowCart(false)}
                  id="cross-icon"
                  height={20}
                  className="cursor-pointer"
                />
              </div>
              <ul>
                {cartData.items.map((item, index) => (
                  <li key={index} className={c.item}>
                    <div className={c.image}>
                      <ImageLoader
                        src={item.image[0]?.url}
                        height={90}
                        width={90}
                        alt={item.name}
                      />
                    </div>
                    <div className={c.content}>
                      <b>{item.name}</b>
                      {item.color.name && (
                        <span>Color - {item.color.name}</span>
                      )}
                      {item.attribute.name && (
                        <p>{`${item.attribute.for}: ${item.attribute.name}`}</p>
                      )}

                      <p>Qty. {item.qty}</p>
                      <p>
                        {`${
                          settings.settingsData.currency.symbol + item.price
                        }`}
                        {item.discount > item.price && (
                          <span>{item.discount || ""}</span>
                        )}
                      </p>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item.uid))}>
                      <Trash color="black" width={20} height={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className={c.total}>
                <span>Subtotal</span>
                <span>
                  {settings.settingsData.currency.symbol}
                  {getTotalPrice()}
                </span>
              </div>
              <div className={c.btn_container}>
                <Link href="/cart">{t("view_cart")}</Link>
                <button onClick={gotoCheckout}>{t("checkout")}</button>
              </div>
            </>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
