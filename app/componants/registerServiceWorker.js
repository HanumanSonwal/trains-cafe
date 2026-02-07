"use client";

import { useEffect, useState } from "react";

export default function RegisterServiceWorker() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
        .catch((err) =>
          console.error("❌ Service Worker registration failed:", err),
        );
    }
    const handleBeforeInstallPrompt = (e) => {
      console.log("🔥 beforeinstallprompt fired");

      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    console.log("User choice:", result.outcome);

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <button
      onClick={handleInstallClick}
      style={{
        backgroundColor: "#d6872a",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "10px",
        fontWeight: "600",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
    >
      📲 Install App
    </button>
  );
}
