"use client";
import { createContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const GlobalLoaderContext = createContext({ loading: false, setLoading: () => {} });

/**
 * Page changes used to cover the whole screen with a white loader for 0.5s, even
 * when the next page was ready. Now a thin brand-coloured bar runs along the top
 * on navigation, and each page shows its own skeleton while its data loads.
 * `loading` / `setLoading` stay available for any code that still uses them.
 */
export default function GlobalLoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const [bar, setBar] = useState("idle"); // idle | running | done
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setBar("running");
    const done = setTimeout(() => setBar("done"), 350);
    const idle = setTimeout(() => setBar("idle"), 750);
    return () => {
      clearTimeout(done);
      clearTimeout(idle);
    };
  }, [pathname]);

  return (
    <GlobalLoaderContext.Provider value={{ loading, setLoading }}>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] bg-gradient-to-r from-[#D6872A] to-[#704D25]"
        style={{
          width: bar === "idle" ? "0%" : bar === "running" ? "70%" : "100%",
          opacity: bar === "idle" || bar === "done" ? (bar === "done" ? 1 : 0) : 1,
          transition: bar === "running" ? "width 0.4s ease-out" : "width 0.2s ease-out, opacity 0.35s ease 0.2s",
        }}
      />
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70">
          <div className="loader"></div>
        </div>
      )}
      {children}
    </GlobalLoaderContext.Provider>
  );
}
