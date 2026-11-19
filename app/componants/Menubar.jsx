"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  DashboardOutlined,
  ShoppingOutlined,
  ContactsOutlined,
  MessageOutlined,
  ShopOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
  TagsOutlined,
  MenuOutlined,
  PercentageOutlined,
  GlobalOutlined,
  FileTextOutlined,
  ReadOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { MODULES, allowedModules, isAdmin } from "@/app/lib/rbac";

const ICONS = {
  dashboard: <DashboardOutlined />,
  orders: <ShoppingOutlined />,
  leads: <ContactsOutlined />,
  inquiries: <MessageOutlined />,
  vendors: <ShopOutlined />,
  requests: <ProfileOutlined />,
  stations: <EnvironmentOutlined />,
  categories: <TagsOutlined />,
  menu: <MenuOutlined />,
  coupons: <PercentageOutlined />,
  pages: <GlobalOutlined />,
  stationpages: <FileTextOutlined />,
  blog: <ReadOutlined />,
  images: <PictureOutlined />,
  users: <SafetyCertificateOutlined />,
};

const USERS_MODULE = { key: "users", label: "Users & Roles", segment: "users", group: "Administration", icon: "users" };

/** "/super-panel/orders" -> "/super-panel", anything else -> "/admin" */
export const panelBase = (pathname = "") => (pathname.startsWith("/super-panel") ? "/super-panel" : "/admin");

export function useNavGroups() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const modules = user ? [...allowedModules(user), ...(isAdmin(user) ? [USERS_MODULE] : [])] : [];
  const groups = [];
  for (const m of modules) {
    let g = groups.find((x) => x.name === m.group);
    if (!g) groups.push((g = { name: m.group, items: [] }));
    g.items.push(m);
  }
  return { groups, loading: status === "loading" };
}

const isActive = (pathname, base, m) => {
  const segs = [m.segment, ...(MODULES.find((x) => x.key === m.key)?.extra || [])];
  return segs.some((s) => pathname === `${base}/${s}` || pathname.startsWith(`${base}/${s}/`));
};

export default function Menubar({ collapsed = false, onNavigate }) {
  const pathname = usePathname() || "";
  const base = panelBase(pathname);
  const { groups, loading } = useNavGroups();

  if (loading) {
    return (
      <div className="space-y-2 px-3 py-2" aria-busy="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <nav aria-label="Main" className="space-y-5 px-3 pb-6">
      {groups.map((group) => (
        <div key={group.name}>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              {group.name}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((m) => {
              const active = isActive(pathname, base, m);
              return (
                <li key={m.key}>
                  <Link
                    href={`${base}/${m.segment}`}
                    onClick={onNavigate}
                    title={collapsed ? m.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors ${
                      active ? "text-[#8a4f10]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } ${collapsed ? "justify-center px-0" : ""}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-[#fff3e0] ring-1 ring-[#D6872A]/20"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className={`relative z-10 text-[17px] transition-transform group-hover:scale-110 ${active ? "text-[#D6872A]" : ""}`}>
                      {ICONS[m.icon]}
                    </span>
                    {!collapsed && <span className="relative z-10 truncate">{m.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
