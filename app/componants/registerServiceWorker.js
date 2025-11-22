"use client";

import { useEffect, useRef } from "react";

export default function RegisterServiceWorker() {
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW Registered:", reg.scope))
        .catch((err) => console.error("SW failed:", err));
    }

    const installBtn = document.getElementById("installAppBtn");

    const handleBeforeInstall = (e) => {
      console.log("🔥 beforeinstallprompt fired");

      e.preventDefault();
      deferredPromptRef.current = e;

      if (installBtn) {
        installBtn.style.display = "block";
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    const handleInstallClick = async () => {
      const deferredPrompt = deferredPromptRef.current;
      if (!deferredPrompt) return;

      deferredPrompt.prompt();

      const result = await deferredPrompt.userChoice;
      console.log("User choice:", result.outcome);

      deferredPromptRef.current = null;

      if (installBtn) installBtn.style.display = "none";
    };

    if (installBtn) {
      installBtn.addEventListener("click", handleInstallClick);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      if (installBtn) {
        installBtn.removeEventListener("click", handleInstallClick);
      }
    };
  }, []);

  return (
    <button
      id="installAppBtn"
      style={{
        display: "none",
        backgroundColor: "#d6872a",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "10px",
        fontWeight: "600",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        zIndex: "9999",
      }}
    >
      📲 Install App
    </button>
  );
}
