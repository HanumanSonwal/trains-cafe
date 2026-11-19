import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import SidebarWrapper from "../componants/SidebarWrapper";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-admin", display: "swap" });

export const metadata = {
  title: "Trains-Cafe Dashboard",
  description: "Trains Cafe admin",
  robots: "noindex, nofollow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.variable}>
        <AntdRegistry>
          <SidebarWrapper>{children}</SidebarWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
