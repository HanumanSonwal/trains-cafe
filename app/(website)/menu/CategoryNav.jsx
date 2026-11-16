"use client";

import { memo, useEffect, useRef } from "react";

/**
 * Sticky, horizontally scrolling category chips ("Snacks 5", "Mains 16", ...).
 * The active chip follows the scroll position; tapping one scrolls to its section.
 * (The whole site renders in a phone-width column, so chips fit better than a sidebar.)
 */
function CategoryNav({ categories, activeId, onPick }) {
  const rowRef = useRef(null);

  // keep the active chip in view inside the row (without moving the page)
  useEffect(() => {
    const row = rowRef.current;
    const btn = row?.querySelector('[aria-current="true"]');
    if (!row || !btn) return;
    row.scrollTo({ left: btn.offsetLeft - row.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [activeId]);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[var(--hdr,72px)] z-30 -mx-4 mb-4 border-b border-gray-100 bg-white/95 backdrop-blur"
    >
      <div ref={rowRef} className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const on = c._id === activeId;
          return (
            <button
              key={c._id}
              type="button"
              aria-current={on ? "true" : undefined}
              onClick={() => onPick(c._id)}
              className={`h-8 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition ${
                on
                  ? "border-[#704D25] bg-[#704D25] text-white"
                  : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
              }`}
            >
              {c.categoryName}
              <span className={`ml-1 font-normal ${on ? "text-white/80" : "text-gray-400"}`}>
                {c.items?.length || 0}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(CategoryNav);
