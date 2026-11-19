"use client";

// Small building blocks shared by the new admin screens: a white Panel, a page header,
// an animated number and a stat card with a soft spotlight that follows the pointer.

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

export function Panel({ title, subtitle, action, children, className = "", bodyClassName = "p-5" }) {
  return (
    <section className={`rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            {title && <h3 className="!m-0 !text-[15px] font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="!m-0 !text-[22px] font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Counts up to `value` when it scrolls into view. */
export function CountUp({ value, decimals = 0, prefix = "", duration = 0.9 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) =>
    `${prefix}${v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, Number(value) || 0, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

export function Trend({ value }) {
  const n = Number(value) || 0;
  const up = n > 0;
  const flat = n === 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
        flat ? "bg-gray-100 text-gray-500" : up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
      }`}
    >
      {flat ? "–" : up ? "▲" : "▼"} {Math.abs(n)}%
    </span>
  );
}

/** KPI card: icon chip, label, animated value and a trend chip. */
export function StatCard({ label, value, decimals = 0, prefix = "", trend, note, icon, tone = "orange", delay = 0 }) {
  const tones = {
    orange: "bg-orange-50 text-[#D6872A]",
    brown: "bg-amber-50 text-[#704D25]",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
  };
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      onMouseMove={onMove}
      className="spot-card group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(16,24,40,0.08)]"
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-gray-900">
            <CountUp value={value} decimals={decimals} prefix={prefix} />
          </p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl transition-transform group-hover:scale-110 ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      <div className="relative z-10 mt-4 flex items-center gap-2 text-xs text-gray-500">
        {trend !== undefined && <Trend value={trend} />}
        <span className="truncate">{note}</span>
      </div>
    </motion.div>
  );
}
