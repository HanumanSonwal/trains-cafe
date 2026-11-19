"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowUpOutlined, CloseOutlined } from "@ant-design/icons";

// Fork-and-knife glyph for the "Menu" pill.
function CutleryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M7 2h1.5v6.2a2 2 0 0 0 1.5-1.94V2h1.5v4.26A3.5 3.5 0 0 1 9 9.64V22H7.5V9.64A3.5 3.5 0 0 1 5 6.26V2h1.5v4.26c0 .9.6 1.67 1.5 1.94V2Zm9.5 0c1.93 0 3.5 2.24 3.5 5 0 2.1-.9 3.9-2.25 4.64V22H16.25V11.64C14.9 10.9 14 9.1 14 7c0-2.76 1.57-5 2.5-5Z" />
    </svg>
  );
}

/**
 * Bottom-centre "Menu" pill (opens the category list) and a round back-to-top
 * button on the right. Both sit above the order bar when the cart has items.
 * The only scroll work is one passive listener that flips a boolean.
 */
function MenuFab({ categories, sectionId, headerOffset = 72 }) {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const hasCart = useSelector((s) => s.cart.items.length > 0);
  const listRef = useRef(null);
  const pillRef = useRef(null);

  // back-to-top appears once the visitor has scrolled past the header card
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShowTop(window.scrollY > 600);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which category is on screen right now; read once, when the list opens.
  const currentCategory = useCallback(() => {
    const line = headerOffset + 24;
    let current = categories[0]?._id ?? null;
    for (const c of categories) {
      const el = document.getElementById(sectionId(c._id));
      if (el && el.getBoundingClientRect().top <= line) current = c._id;
    }
    return current;
  }, [categories, sectionId, headerOffset]);

  const openList = () => {
    setActiveId(currentCategory());
    setOpen(true);
  };
  const close = useCallback(() => {
    setOpen(false);
    pillRef.current?.focus({ preventScroll: true });
  }, []);

  // Esc closes; the page behind does not scroll while the list is open; focus the current row.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const row = listRef.current?.querySelector('[aria-current="true"]') || listRef.current?.querySelector("button");
    row?.scrollIntoView({ block: "center" });
    row?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  const jump = (id) => {
    setOpen(false);
    // let the body scroll again before scrolling to the section
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId(id));
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  if (!categories.length) return null;

  // 72px mobile footer (+ the order bar when the cart has items)
  const bottom = hasCart ? "bottom-[152px]" : "bottom-[88px]";

  return (
    <>
      <div className={`pointer-events-none fixed inset-x-0 ${bottom} z-40 mx-auto w-full max-w-[590px] transition-[bottom] duration-200`}>
        <div className="relative flex justify-center">
          {!open && (
            <button
              ref={pillRef}
              type="button"
              onClick={openList}
              aria-haspopup="dialog"
              className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition active:scale-95"
            >
              <CutleryIcon />
              Menu
            </button>
          )}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            tabIndex={showTop ? 0 : -1}
            className={`pointer-events-auto absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-[#3a3a3a] text-lg text-white shadow-[0_6px_18px_rgba(0,0,0,0.3)] transition duration-200 active:scale-95 ${
              showTop && !open ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
            }`}
          >
            <ArrowUpOutlined />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end bg-black/50 px-4 pb-[96px] [animation:fadeIn_.15s_ease-out]" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu categories"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] overflow-hidden rounded-2xl bg-white shadow-2xl [animation:popIn_.18s_ease-out]"
          >
            <ul ref={listRef} className="max-h-[60vh] overflow-y-auto overscroll-contain py-2">
              {categories.map((c) => {
                const on = c._id === activeId;
                return (
                  <li key={c._id}>
                    <button
                      type="button"
                      aria-current={on ? "true" : undefined}
                      onClick={() => jump(c._id)}
                      className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left text-[15px] transition focus:outline-none focus-visible:bg-gray-100 ${
                        on ? "font-semibold text-[#704D25]" : "text-gray-800 active:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {on && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D6872A]" aria-hidden="true" />}
                        {c.categoryName}
                      </span>
                      <span className="shrink-0 tabular-nums text-gray-500">{c.items?.length || 0}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <button
            type="button"
            onClick={close}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-[15px] font-semibold text-white shadow-lg active:scale-95"
          >
            <CloseOutlined /> Close
          </button>
        </div>
      )}
    </>
  );
}

export default memo(MenuFab);
