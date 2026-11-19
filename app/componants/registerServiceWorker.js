"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

function Step({ n, children }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#fff1dc] text-xs font-bold text-[#704D25]">{n}</span>
      <span className="pt-0.5 text-sm text-gray-700">{children}</span>
    </li>
  );
}

/**
 * Registers the service worker and shows the "Get App" pill in the header.
 * The pill is always visible. Where the browser can install the site (Chrome /
 * Android) a tap opens the install prompt; elsewhere (iPhone, other browsers)
 * it shows the two steps to add Trainscafe to the home screen.
 */
export default function RegisterServiceWorker() {
  const promptRef = useRef(null);
  const [help, setHelp] = useState(null); // null | "ios" | "other" | "installed"

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e) => {
      e.preventDefault(); // our pill replaces the browser's own mini-bar
      promptRef.current = e;
    };
    const onInstalled = () => (promptRef.current = null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    const prompt = promptRef.current;
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice.catch(() => null);
      promptRef.current = null; // the browser allows one prompt per event
      return;
    }
    setHelp(isStandalone() ? "installed" : isIOS() ? "ios" : "other");
  };

  return (
    <>
      <button
        type="button"
        onClick={install}
        aria-label="Get the Trainscafe app"
        className="app-pill relative inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#E09A3E] to-[#C26E1C] pl-1.5 pr-4 text-[13.5px] font-bold text-white shadow-[0_4px_14px_rgba(214,135,42,0.45)] ring-1 ring-white/30 transition hover:brightness-105 active:scale-95"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/25">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v11" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 20h14" />
          </svg>
        </span>
        Get App
      </button>

      <Modal open={!!help} onCancel={() => setHelp(null)} footer={null} centered width={340} title="Get the Trainscafe app">
        {help === "installed" ? (
          <p className="text-sm text-gray-700">You are already using the Trainscafe app. Enjoy your meal!</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-gray-600">Add Trainscafe to your home screen for one-tap ordering.</p>
            <ol className="space-y-2.5">
              {help === "ios" ? (
                <>
                  <Step n={1}>
                    Tap the <b>Share</b> button in Safari (the square with an arrow).
                  </Step>
                  <Step n={2}>
                    Choose <b>Add to Home Screen</b>, then tap <b>Add</b>.
                  </Step>
                </>
              ) : (
                <>
                  <Step n={1}>
                    Open your browser menu (<b>⋮</b> at the top right).
                  </Step>
                  <Step n={2}>
                    Tap <b>Install app</b> or <b>Add to Home screen</b>.
                  </Step>
                </>
              )}
            </ol>
          </>
        )}
      </Modal>
    </>
  );
}
