import { Inter } from "next/font/google";
import "../globals.css";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import MobileFooter from "../componants/MobileFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trains Cafe",
  description: "Food delivery in Train",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{maxWidth:"575px",margin:"0 auto"}} className={inter.className}>
      <Header/>
        {children}
        <MobileFooter />
        <Footer/>
        </body>
    </html>
  );
}
