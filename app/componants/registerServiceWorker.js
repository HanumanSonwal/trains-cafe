"use client";
import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker registered:", registration.scope);
          })
          .catch((err) => {
            console.error("❌ SW registration failed:", err);
          });
      });
    }
    let deferredPrompt;
    const installButton = document.getElementById("installAppBtn");

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installButton) {
        installButton.style.display = "block";
      }
    });

    if (installButton) {
      installButton.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User response:", outcome);
        deferredPrompt = null;
        installButton.style.display = "none";
      });
    }

    window.addEventListener("appinstalled", () => {
      console.log("✅ App installed successfully!");
      if (installButton) installButton.style.display = "none";
    });
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
