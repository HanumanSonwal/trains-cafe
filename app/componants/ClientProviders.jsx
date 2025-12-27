"use client";

import { Provider } from "react-redux";
import store from "../redux/store";
import GlobalLoaderProvider from "./GlobalLoaderContext";
import SeoNavigation from "./SeoNavigation";

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <GlobalLoaderProvider>
        <SeoNavigation />
        {children}
      </GlobalLoaderProvider>
    </Provider>
  );
}
