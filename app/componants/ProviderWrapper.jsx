"use client";

import MobileFooter from './MobileFooter';
import Footer from './Footer';
import Header from './Header';
import { Provider } from 'react-redux';
import store, { persistor } from "../redux/store";
import { PersistGate } from 'redux-persist/integration/react';

const ProviderWrapper = ({ children }) => {
  return (
    <Provider store={store}>
 <PersistGate loading={null} persistor={persistor}>
        <Header />
        {children}
        <MobileFooter />
        <Footer />
        </PersistGate>
    </Provider>
  );
};

export default ProviderWrapper;
