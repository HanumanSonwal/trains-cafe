"use client";
import { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export const GlobalLoaderContext = createContext();

export default function GlobalLoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
  }, [pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <GlobalLoaderContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-[9999]">
          <div className="loader"></div>
        </div>
      )}
      {children}
    </GlobalLoaderContext.Provider>
  );
}
