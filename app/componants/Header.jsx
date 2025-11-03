// "use client";

// import { useState, useEffect } from "react";
// import {
//   PhoneOutlined,
//   WhatsAppOutlined,
//   ShoppingCartOutlined,
//   DownloadOutlined,
//   DeleteFilled,
// } from "@ant-design/icons";
// import { Badge, Modal, Button } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import Link from "next/link";
// import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";

// export default function Header() {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [showInstall, setShowInstall] = useState(true);

//   console.log(showInstall , "showInstall");

//   const dispatch = useDispatch();
//   const cartItemsRaw = useSelector((state) => state.cart.items);
//   const cartItems = Array.isArray(cartItemsRaw) ? cartItemsRaw : [];
//   const totalUniqueItems = cartItems.length;

//   const toggleCart = () => setIsCartOpen((prev) => !prev);
//   const handleClose = () => setIsCartOpen(false);

//   const handleIncreaseQuantity = (item) => {
//     dispatch(addItemToCart(item));
//   };

//   const handleDecreaseQuantity = (item) => {
//     if (item.quantity > 1) {
//       dispatch(
//         updateItemQuantity({ id: item._id, quantity: item.quantity - 1 })
//       );
//     } else {
//       Modal.confirm({
//         title: "Remove Item",
//         content: "Do you want to remove this item from the cart?",
//         okText: "Yes",
//         cancelText: "No",
//         onOk: () => {
//           dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
//         },
//       });
//     }
//   };

//   const handleDeleteItem = (item) => {
//     Modal.confirm({
//       title: "Delete Item",
//       content: "Are you sure you want to delete this item?",
//       okText: "Yes",
//       cancelText: "No",
//       onOk: () => {
//         dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
//       },
//     });
//   };

//   const totalPrice = cartItems.reduce((total, item) => {
//     return total + item.price * item.quantity;
//   }, 0);

//   useEffect(() => {
//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowInstall(true);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;

//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;

//     setDeferredPrompt(null);
//     setShowInstall(false);
//   };

//   return (
//     <div className="sticky top-0 z-50 mx-auto">
//       <header className="relative flex flex-col items-center p-4 bg-white shadow-md">
//         <div className="flex justify-between items-center w-full">
//           <Link href="/">
//             <img src="/images/logo.svg" alt="Logo" className="h-10" />
//           </Link>
//           <div className="flex items-center gap-4">
//             {showInstall && (
//               <button
//                 onClick={handleInstallClick}
//                 className="install-button text-[#6F4D27]"
//                 title="Install App"
//               >
//                 <DownloadOutlined style={{ fontSize: "24px" }} />
//               </button>
//             )}

//             <button className="cart-button" onClick={toggleCart}>
//               <Badge count={totalUniqueItems} showZero>
//                 <ShoppingCartOutlined style={{ fontSize: "24px" }} />
//               </Badge>
//             </button>
//           </div>
//         </div>
//       </header>

//       <Modal
//         title="Cart Items"
//         open={isCartOpen}
//         onCancel={handleClose}
//         footer={null}
//         width={400}
//       >
//         <ul>
//           {totalUniqueItems > 0 ? (
//             cartItems.map((item) => (
//               <li
//                 key={item._id}
//                 className="flex justify-between items-center py-4 border-b border-gray-300"
//               >
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="h-16 w-16 object-cover rounded-md"
//                   />
//                   <div className="flex flex-col">
//                     <span
//                       className="font-semibold"
//                       style={{ color: "#6F4D27" }}
//                     >
//                       {item.name}
//                     </span>
//                     <span className="text-sm text-gray-500">₹{item.price}</span>
//                     <span className="text-sm text-gray-500 font-bold">
//                       Total: ₹{(item.price * item.quantity).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     style={{
//                       backgroundColor: "#FAF3CC",
//                       borderColor: "#D6872A",
//                       color: "#6F4D27",
//                     }}
//                     onClick={() => handleDecreaseQuantity(item)}
//                     className="rounded-full w-8 h-8 flex justify-center items-center transition-all duration-300 transform hover:scale-110"
//                     size="small"
//                   >
//                     -
//                   </Button>
//                   <span className="mx-2 font-semibold">{item.quantity}</span>
//                   <Button
//                     style={{
//                       backgroundColor: "#FAF3CC",
//                       borderColor: "#D6872A",
//                       color: "#6F4D27",
//                     }}
//                     onClick={() => handleIncreaseQuantity(item)}
//                     className="rounded-full w-8 h-8 flex justify-center items-center transition-all duration-300 transform hover:scale-110"
//                     size="small"
//                   >
//                     +
//                   </Button>
//                   <Button
//                     onClick={() => handleDeleteItem(item)}
//                     icon={<DeleteFilled />}
//                     danger
//                   />
//                 </div>
//               </li>
//             ))
//           ) : (
//             <p>No items in the cart.</p>
//           )}
//         </ul>

//         {totalUniqueItems > 0 && (
//           <div className="mt-4">
//             <span className="text-xl font-bold">
//               Total: ₹ {totalPrice.toFixed(2)}
//             </span>
//             <div className="flex justify-between mt-4">
//               <Link href="/cart">
//                 <Button
//                   type="primary"
//                   className="w-full mr-2"
//                   onClick={handleClose}
//                   style={{
//                     backgroundColor: "#FAF3CC",
//                     borderColor: "#D6872A",
//                     color: "#6F4D27",
//                   }}
//                 >
//                   Go to Cart
//                 </Button>
//               </Link>
//               <Link href="/checkout">
//                 <Button
//                   type="primary"
//                   className="w-full"
//                   onClick={handleClose}
//                   style={{
//                     backgroundColor: "#FAF3CC",
//                     borderColor: "#D6872A",
//                     color: "#6F4D27",
//                   }}
//                 >
//                   Checkout
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCartOutlined,
  DownloadOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { Badge, Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { addItemToCart, updateItemQuantity } from "@/app/redux/cartSlice";
import RegisterServiceWorker from "./registerServiceWorker";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  const dispatch = useDispatch();
  const cartItemsRaw = useSelector((state) => state.cart.items);
  const cartItems = Array.isArray(cartItemsRaw) ? cartItemsRaw : [];
  const totalUniqueItems = cartItems.length;

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

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // ✅ Handle PWA install prompt visibility and logic
  useEffect(() => {
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

    if (!isMobileDevice) {
      setShowInstall(false);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isInStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      if (isInStandaloneMode) {
        setShowInstall(false);
      }
    };

    checkIfInstalled();

    // Hide button after install
    window.addEventListener("appinstalled", () => {
      console.log("PWA installed");
      setShowInstall(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    <div className="sticky top-0 z-50 mx-auto">
      <header className="relative flex flex-col items-center p-4 bg-white shadow-md">
        <div className="flex justify-between items-center w-full">
          <Link href="/">
            <img src="/images/logo.svg" alt="Logo" className="h-10" />
          </Link>

<RegisterServiceWorker/> 

{showInstall && (
  <button
    onClick={handleInstallClick}
    className="flex items-center gap-1 bg-[#D6872A] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#6F4D27] transition-all"
  >
    <DownloadOutlined />
    Install App
  </button>
)}


          <div className="flex items-center gap-4">
            {showInstall && (
              <button
                onClick={handleInstallClick}
                className="install-button text-[#6F4D27] hover:text-[#D6872A] transition-all"
                title="Install App"
              >
                <DownloadOutlined style={{ fontSize: "24px" }} />
              </button>
            )}

            <button className="cart-button" onClick={toggleCart}>
              <Badge count={totalUniqueItems} showZero>
                <ShoppingCartOutlined style={{ fontSize: "24px" }} />
              </Badge>
            </button>
          </div>
        </div>
      </header>

      {/* 🛒 CART MODAL */}
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
