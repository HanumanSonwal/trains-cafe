import { Inter } from "next/font/google";
import "../globals.css";
import Header from "../componants/Header"; 
import { AntdRegistry } from '@ant-design/nextjs-registry';

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
      <body 
        className={inter.className} 
        style={{
          maxWidth: "575px",
          margin: "0 auto",
        }}
      >
        <AntdRegistry>
          <Header/>
          {children}
          <MobileFooter/>
          <Footer/>
        </AntdRegistry>
      </body>
    </html>
  );
}
