"use client";

import React from "react";
import { Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { MODULES } from "@/app/lib/rbac";
import { panelBase } from "./Menubar";

const ROLE_LABEL = { admin: "Admin", "sub-admin": "Sub admin", staff: "Staff" };

function pageTitle(pathname, base) {
  const seg = pathname.slice(base.length + 1).split("/")[0];
  if (seg === "users") return "Users & Roles";
  return MODULES.find((m) => m.segment === seg || (m.extra || []).includes(seg))?.label || "Dashboard";
}

export default function DashHeader({ collapsed, toggleCollapsed, desktop }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname() || "";
  const base = panelBase(pathname);
  const user = session?.user;

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => router.push(base === "/super-panel" ? "/super-panel-auth" : "/admin-auth"));
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-[68px] shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white/85 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#D6872A]/50 hover:text-[#D6872A] active:scale-95"
        >
          {desktop && collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-gray-900">{pageTitle(pathname, base)}</p>
          <p className="hidden truncate text-xs text-gray-500 sm:block">Trains Cafe {base === "/super-panel" ? "Super Panel" : "Admin"}</p>
        </div>
      </div>

      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{
          items: [
            {
              key: "who",
              disabled: true,
              label: (
                <div className="py-1">
                  <p className="m-0 text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="m-0 text-xs text-gray-500">{user?.email}</p>
                </div>
              ),
            },
            { type: "divider" },
            { key: "logout", icon: <LogoutOutlined />, label: "Sign out", danger: true, onClick: handleLogout },
          ],
        }}
      >
        <button type="button" className="flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-gray-200 hover:bg-gray-50">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#D6872A] to-[#704D25] text-sm font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block max-w-[140px] truncate text-[13px] font-semibold leading-tight text-gray-900">{user?.name || "…"}</span>
            <span className="block text-[11px] leading-tight text-gray-500">{ROLE_LABEL[user?.role] || ""}</span>
          </span>
          <DownOutlined className="hidden text-[10px] text-gray-400 sm:block" />
        </button>
      </Dropdown>
    </header>
  );
}
