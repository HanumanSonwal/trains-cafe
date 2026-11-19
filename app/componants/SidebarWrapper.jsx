"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import DashHeader from "./DashHeader";
import store from "../redux/store";
import { adminTheme } from "./admin/adminTheme";
import "./admin/admin.css";

function useIsDesktop() {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
}

const SidebarWrapper = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktop = useIsDesktop();
  const pathname = usePathname();

  useEffect(() => setMobileOpen(false), [pathname]);

  const toggle = () => (desktop ? setCollapsed((c) => !c) : setMobileOpen((o) => !o));

  return (
    <SessionProvider>
      <Provider store={store}>
        <ConfigProvider theme={adminTheme}>
          <div className="admin-shell flex h-screen overflow-hidden bg-[#f6f7f9]">
            <Sidebar collapsed={collapsed} desktop={desktop} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
              <DashHeader collapsed={collapsed} toggleCollapsed={toggle} desktop={desktop} />
              <main className="admin-main flex-1 overflow-y-auto p-4 sm:p-6">
                {/* a short fade/rise each time the page changes */}
                <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
                  {children}
                </motion.div>
              </main>
            </div>
          </div>
        </ConfigProvider>
      </Provider>
    </SessionProvider>
  );
};

export default SidebarWrapper;
