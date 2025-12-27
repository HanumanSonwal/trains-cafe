import Header from "./Header";
import Footer from "./Footer";
import MobileFooter from "./MobileFooter";

export default function AppShell({ children }) {
  return (
    <>
      <Header />
      {children}
      <MobileFooter />
      <Footer />
    </>
  );
}
