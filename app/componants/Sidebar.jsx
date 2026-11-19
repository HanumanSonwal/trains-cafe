"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Menubar, { panelBase } from "./Menubar";

const OPEN = 264;
const CLOSED = 76;

/**
 * White sidebar. On desktop it collapses to icons; below 1024px it is a drawer
 * that slides over the page (the parent passes `mobileOpen`).
 */
export default function Sidebar({ collapsed, desktop, mobileOpen, onClose }) {
  const base = panelBase(usePathname() || "");
  const narrow = desktop && collapsed;

  return (
    <>
      {!desktop && mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <motion.aside
        initial={false}
        animate={desktop ? { width: narrow ? CLOSED : OPEN } : { x: mobileOpen ? 0 : -OPEN - 8 }}
        transition={{ type: "spring", stiffness: 380, damping: 38 }}
        style={desktop ? undefined : { width: OPEN }}
        className={`z-40 flex h-screen shrink-0 flex-col border-r border-gray-100 bg-white ${
          desktop ? "relative" : "fixed left-0 top-0 shadow-2xl"
        }`}
      >
        <Link href={`${base}/dashboard`} className={`flex h-[68px] shrink-0 items-center border-b border-gray-100 ${narrow ? "justify-center" : "px-5"}`}>
          {narrow ? (
            <Image src="/images/logo.svg" alt="Trains Cafe" width={44} height={44} className="h-9 w-9 object-cover object-left" />
          ) : (
            <Image src="/images/logo.svg" alt="Trains Cafe" width={150} height={50} className="h-10 w-auto" priority />
          )}
        </Link>
        <div className="flex-1 overflow-y-auto pt-4">
          <Menubar collapsed={narrow} onNavigate={desktop ? undefined : onClose} />
        </div>
      </motion.aside>
    </>
  );
}
