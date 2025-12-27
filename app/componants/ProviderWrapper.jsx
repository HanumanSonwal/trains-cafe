"use client";

import { useEffect, useState } from "react";
import MobileFooter from "./MobileFooter";
import Footer from "./Footer";
import Header from "./Header";
import { Provider } from "react-redux";
import store from "../redux/store";
import GlobalLoaderProvider from "./GlobalLoaderContext";

const ProviderWrapper = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Provider store={store}>
      <GlobalLoaderProvider>
        <Header />
        {children}
        <MobileFooter />
        <Footer />
      </GlobalLoaderProvider>
    </Provider>
  );
};

export default ProviderWrapper;
