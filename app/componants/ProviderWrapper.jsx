// "use client";

// import { useEffect, useState } from 'react';
// import MobileFooter from './MobileFooter';
// import Footer from './Footer';
// import Header from './Header';
// import { Provider } from 'react-redux';
// import store, { persistor } from "../redux/store";
// import { PersistGate } from 'redux-persist/integration/react';

// const ProviderWrapper = ({ children }) => {
//   const [isClient, setIsClient] = useState(false);

//   // This effect will ensure the code is only run on the client side
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return null; // Prevent SSR issues by rendering nothing on the server
//   }

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <Header />
//         {children}
//         <MobileFooter />
//         <Footer />
//       </PersistGate>
//     </Provider>
//   );
// };

// export default ProviderWrapper;


"use client";

import { useEffect, useState } from 'react';
import MobileFooter from './MobileFooter';
import Footer from './Footer';
import Header from './Header';
import { Provider } from 'react-redux';
import store from "../redux/store"; 

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
      <Header />
      {children}
      <MobileFooter />
      <Footer />
    </Provider>
  );
};

export default ProviderWrapper;
