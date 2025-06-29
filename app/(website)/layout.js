import { Inter } from "next/font/google";
import "../globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ProviderWrapper from "../componants/ProviderWrapper";
import NextBreadcrumb from "../componants/Breadcrumbs";

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
          <ProviderWrapper>
            {children}
          {/* <NextBreadcrumb /> */}

          </ProviderWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
