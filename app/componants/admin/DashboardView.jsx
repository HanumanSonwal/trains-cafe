"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ShoppingOutlined,
  WalletOutlined,
  TeamOutlined,
  LineChartOutlined,
  PlusOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { CountUp, PageHeader, Panel, StatCard } from "./ui";
import { can } from "@/app/lib/rbac";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

function Donut({ data, colors, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[150px] w-[150px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={total ? data : [{ name: "none", value: 1 }]} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={total ? 3 : 0} stroke="none" animationDuration={900}>
              {(total ? data : [{ name: "none" }]).map((_, i) => (
                <Cell key={i} fill={total ? colors[i] : "#eef0f3"} />
              ))}
            </Pie>
            {total > 0 && <Tooltip formatter={(v, n) => [v, n]} />}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[22px] font-bold leading-none text-gray-900">{centerValue}</p>
            <p className="mt-1 text-[11px] text-gray-500">{centerLabel}</p>
          </div>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-3">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i] }} />
              {d.name}
            </span>
            <span className="font-semibold text-gray-900">
              {d.value}
              {d.sub && <span className="ml-1.5 text-xs font-normal text-gray-400">{d.sub}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true">
      <Skeleton.Input active style={{ width: 260, height: 32 }} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[138px] animate-pulse rounded-2xl bg-white ring-1 ring-gray-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="h-[340px] animate-pulse rounded-2xl bg-white ring-1 ring-gray-100 xl:col-span-2" />
        <div className="h-[340px] animate-pulse rounded-2xl bg-white ring-1 ring-gray-100" />
      </div>
      <div className="h-[300px] animate-pulse rounded-2xl bg-white ring-1 ring-gray-100" />
    </div>
  );
}

export default function DashboardView() {
  const { data: session } = useSession();
  const base = (usePathname() || "").startsWith("/super-panel") ? "/super-panel" : "/admin";
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/dashboard/sales")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => alive && setData(j))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  const user = session?.user;
  const chart = useMemo(
    () => (data?.monthlySales || []).map((m) => ({ name: m.month, revenue: parseFloat(m.totalSales) || 0, orders: m.totalOrders || 0 })),
    [data]
  );

  if (error) {
    return (
      <Panel>
        <p className="py-10 text-center text-sm text-gray-500">Could not load the dashboard. Please refresh the page.</p>
      </Panel>
    );
  }
  if (!data) return <DashboardSkeleton />;

  const s = data.summaryCards || {};
  const pay = data.paymentStats || {};
  const st = data.orderStatusStats || {};
  const yearTotal = chart.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${greeting()}${user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋`}
        subtitle={`${dayjs().format("dddd, D MMMM YYYY")} · here is how Trains Cafe is doing`}
        actions={
          can(user, "orders", "view") && (
            <Link href={`${base}/orders`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#D6872A] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(214,135,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0">
              <PlusOutlined /> New order
            </Link>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's orders" value={s.todaysOrders?.count} trend={s.todaysOrders?.percentage} note="vs yesterday" icon={<ShoppingOutlined />} tone="orange" delay={0} />
        <StatCard label="Today's earnings" value={s.todaysEarnings?.amount} prefix="₹" decimals={0} trend={s.todaysEarnings?.percentage} note="vs yesterday" icon={<WalletOutlined />} tone="green" delay={0.06} />
        <StatCard label="Today's customers" value={s.todaysCustomers?.count} trend={s.todaysCustomers?.percentage} note="vs yesterday" icon={<TeamOutlined />} tone="blue" delay={0.12} />
        <StatCard label="Avg. daily earnings" value={s.monthlyAverageEarnings?.amount} prefix="₹" trend={s.monthlyAverageEarnings?.percentage} note="vs last month" icon={<LineChartOutlined />} tone="brown" delay={0.18} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Sales this year"
          subtitle="Revenue collected per month (cancelled orders excluded)"
          action={
            <div className="text-right">
              <p className="text-[11px] text-gray-500">Year total</p>
              <p className="text-lg font-bold text-gray-900">
                <CountUp value={yearTotal} prefix="₹" />
              </p>
            </div>
          }
        >
          <div className="h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D6872A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#D6872A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f3" />
                <XAxis dataKey="name" tickFormatter={(v) => String(v).slice(0, 3)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                <Tooltip
                  cursor={{ stroke: "#D6872A", strokeOpacity: 0.3 }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #eef0f3", boxShadow: "0 10px 30px rgba(16,24,40,0.1)" }}
                  formatter={(v, n) => (n === "revenue" ? [inr(v), "Revenue"] : [v, "Orders"])}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D6872A" strokeWidth={2.5} fill="url(#rev)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Payments" subtitle="COD vs online">
            <Donut
              data={[
                { name: "Cash on delivery", value: pay.cod || 0, sub: inr(pay.codAmount) },
                { name: "Online", value: pay.online || 0, sub: inr(pay.onlineAmount) },
              ]}
              colors={["#D6872A", "#704D25"]}
              centerValue={(pay.cod || 0) + (pay.online || 0)}
              centerLabel="orders"
            />
          </Panel>
          <Panel title="Fulfilment" subtitle="Delivered vs cancelled">
            <Donut
              data={[
                { name: "Delivered", value: st.delivered || 0, sub: `${st.deliveredPercentage || 0}%` },
                { name: "Cancelled", value: st.cancel || 0, sub: `${st.cancelPercentage || 0}%` },
              ]}
              colors={["#10b981", "#f43f5e"]}
              centerValue={`${st.deliveredPercentage || 0}%`}
              centerLabel="delivered"
            />
          </Panel>
        </div>
      </div>

      <Panel
        title="Waiting for action"
        subtitle={`${data.pendingCount ?? data.pendingOrders?.length ?? 0} placed orders not yet confirmed`}
        bodyClassName="p-0"
        action={
          can(user, "orders", "view") && (
            <Link href={`${base}/orders`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8651B] hover:underline">
              All orders <ArrowRightOutlined className="text-xs" />
            </Link>
          )
        }
      >
        {data.pendingOrders?.length ? (
          <ul className="divide-y divide-gray-100">
            {data.pendingOrders.map((o, i) => (
              <motion.li
                key={o._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-[#fffaf3]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    #{o.order_id} <span className="font-normal text-gray-400">· {o.user_details?.name || "Guest"}</span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {o.vendor?.Vendor_Name || "Vendor"} · {o.station?.name || "Station"}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden text-xs text-gray-500 sm:block">
                    <p className="m-0">Delivery</p>
                    <p className="m-0 font-medium text-gray-700">{o.deliveryDateTime ? dayjs(o.deliveryDateTime).format("D MMM, h:mm A") : "—"}</p>
                  </div>
                  <p className="m-0 w-20 text-sm font-bold text-gray-900">{inr(o.total)}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-gray-500">All caught up. No orders are waiting. 🎉</p>
        )}
      </Panel>
    </div>
  );
}
