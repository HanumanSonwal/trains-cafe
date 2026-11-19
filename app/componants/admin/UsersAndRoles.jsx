"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Button, Input, Modal, Popconfirm, Segmented, Select, Switch, Table, Tag, Tooltip, message } from "antd";
import { DeleteOutlined, EditOutlined, KeyOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PageHeader, Panel } from "./ui";
import { MODULES } from "@/app/lib/rbac";

const ROLE_TAG = {
  admin: { color: "red", label: "Admin" },
  "sub-admin": { color: "gold", label: "Sub admin" },
  staff: { color: "blue", label: "Staff" },
};

// Quick starting points; the admin can still tick anything on top.
const PRESETS = [
  { label: "Order manager", perms: { orders: "full", leads: "view", dashboard: "view" } },
  { label: "Vendor manager", perms: { vendors: "full", "vendor-requests": "full", stations: "view", "menu-items": "view" } },
  { label: "Catalogue editor", perms: { "menu-items": "full", categories: "full", vendors: "view", stations: "view" } },
  { label: "Content editor", perms: { blog: "full", "website-pages": "full", "station-pages": "full", images: "full" } },
];

const GROUPS = [...new Set(MODULES.map((m) => m.group))];

const emptyForm = { name: "", email: "", password: "", role: "staff", perms: {}, active: true };

function accessSummary(u) {
  if (u.role !== "staff") return <span className="text-gray-500">Everything</span>;
  const list = u.permissions || [];
  if (!list.length) return <span className="text-gray-400">No access</span>;
  const label = (p) => `${MODULES.find((m) => m.key === p.name)?.label || p.name}${p.level === "view" ? " (view)" : ""}`;
  return (
    <div className="flex max-w-[360px] flex-wrap gap-1">
      {list.slice(0, 4).map((p) => (
        <Tag key={p.name} className="!m-0" color={p.level === "full" ? "orange" : "default"}>
          {label(p)}
        </Tag>
      ))}
      {list.length > 4 && (
        <Tooltip title={list.slice(4).map(label).join(", ")}>
          <Tag className="!m-0">+{list.length - 4} more</Tag>
        </Tooltip>
      )}
    </div>
  );
}

function PermissionMatrix({ perms, onChange }) {
  const set = (key, level) => {
    const next = { ...perms };
    if (level === "none") delete next[key];
    else next[key] = level;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Start from</span>
        {PRESETS.map((p) => (
          <button key={p.label} type="button" onClick={() => onChange({ ...p.perms })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-[#D6872A] hover:text-[#B8651B]">
            {p.label}
          </button>
        ))}
        <button type="button" onClick={() => onChange(Object.fromEntries(MODULES.map((m) => [m.key, "full"])))} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-[#D6872A] hover:text-[#B8651B]">
          Everything
        </button>
        <button type="button" onClick={() => onChange({})} className="rounded-full px-3 py-1 text-xs font-semibold text-gray-400 hover:text-rose-600">
          Clear
        </button>
      </div>

      {GROUPS.map((g) => (
        <div key={g}>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">{g}</p>
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
            {MODULES.filter((m) => m.group === g).map((m) => (
              <div key={m.key} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="text-sm font-medium text-gray-800">{m.label}</span>
                <Segmented
                  size="small"
                  value={perms[m.key] || "none"}
                  onChange={(v) => set(m.key, v)}
                  options={[
                    { label: "None", value: "none" },
                    { label: "View", value: "view" },
                    { label: "Full", value: "full" },
                  ]}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-500">
        <b>View</b> can open the page and read. <b>Full</b> can also add, edit and delete.
      </p>
    </div>
  );
}

export default function UsersAndRoles() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null); // null | { user?: row }
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setRows(json.data);
      setTotal(json.total);
    } catch (e) {
      message.error(e.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const openNew = () => {
    setForm(emptyForm);
    setModal({});
  };
  const openEdit = (u) => {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      perms: Object.fromEntries((u.permissions || []).map((p) => [p.name, p.level])),
      active: u.active !== false,
    });
    setModal({ user: u });
  };

  const body = useMemo(
    () => ({
      name: form.name,
      role: form.role,
      permissions: Object.entries(form.perms).map(([name, level]) => ({ name, level })),
      active: form.active,
    }),
    [form]
  );

  const save = async () => {
    const editing = modal?.user;
    if (!form.name.trim()) return message.warning("Enter a name");
    if (!editing && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return message.warning("Enter a valid email");
    if (!editing && form.password.length < 8) return message.warning("Password must be at least 8 characters");
    if (editing && form.password && form.password.length < 8) return message.warning("New password must be at least 8 characters");
    if (form.role === "staff" && body.permissions.length === 0) return message.warning("Give this user access to at least one module");

    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/admin/users/${editing._id}` : "/api/admin/users", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, ...(editing ? (form.password ? { password: form.password } : {}) : { email: form.email, password: form.password }) }),
      });
      const json = await res.json();
      if (!json.success) return message.error(json.message || "Could not save");
      message.success(editing ? "User updated" : "User created. Share the email and password with them.");
      setModal(null);
      load();
    } catch {
      message.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u, active) => {
    const res = await fetch(`/api/admin/users/${u._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active }) });
    const json = await res.json();
    json.success ? load() : message.error(json.message);
  };

  const remove = async (u) => {
    const res = await fetch(`/api/admin/users/${u._id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      message.success("User deleted");
      load();
    } else message.error(json.message);
  };

  const columns = [
    {
      title: "User",
      render: (_, u) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D6872A] to-[#704D25] text-sm font-bold text-white">
            {u.name?.[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="m-0 truncate font-semibold text-gray-900">{u.name}</p>
            <p className="m-0 truncate text-xs text-gray-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    { title: "Role", dataIndex: "role", width: 110, render: (r) => <Tag color={ROLE_TAG[r]?.color}>{ROLE_TAG[r]?.label || r}</Tag> },
    { title: "Can access", render: (_, u) => accessSummary(u) },
    {
      title: "Active",
      width: 90,
      render: (_, u) => <Switch size="small" checked={u.active !== false} onChange={(v) => toggleActive(u, v)} />,
    },
    {
      title: "",
      width: 120,
      render: (_, u) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip title="Edit access / reset password">
            <Button type="text" icon={u.role === "staff" ? <EditOutlined /> : <KeyOutlined />} onClick={() => openEdit(u)} />
          </Tooltip>
          <Popconfirm title="Delete this user?" description="They will not be able to sign in again." okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => remove(u)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Create panel logins and choose exactly which modules each person can use."
        actions={
          <>
            <Input allowClear prefix={<SearchOutlined className="text-gray-400" />} placeholder="Search name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: 230 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
              New user
            </Button>
          </>
        }
      />

      <Panel bodyClassName="p-0">
        <Table rowKey="_id" loading={loading} columns={columns} dataSource={rows} scroll={{ x: 760 }} pagination={{ current: page, total, pageSize: 10, onChange: setPage, showSizeChanger: false }} />
      </Panel>

      <Modal
        open={!!modal}
        onCancel={() => setModal(null)}
        title={modal?.user ? "Edit user" : "New user"}
        okText={modal?.user ? "Save changes" : "Create user"}
        onOk={save}
        confirmLoading={saving}
        width={620}
        destroyOnClose
        styles={{ body: { maxHeight: "68vh", overflowY: "auto", paddingRight: 4 } }}
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-500">Name</span>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-500">Email (login)</span>
              <Input value={form.email} disabled={!!modal?.user} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-500">{modal?.user ? "New password (optional)" : "Password"}</span>
              <Input.Password value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" autoComplete="new-password" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-500">Role</span>
              <Select
                className="w-full"
                value={form.role}
                onChange={(role) => setForm({ ...form, role })}
                options={[
                  { value: "staff", label: "Staff (choose modules)" },
                  { value: "sub-admin", label: "Sub admin (everything)" },
                  { value: "admin", label: "Admin (everything + users)" },
                ]}
              />
            </label>
          </div>

          {form.role === "staff" ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">Module access</p>
              <PermissionMatrix perms={form.perms} onChange={(perms) => setForm({ ...form, perms })} />
            </div>
          ) : (
            <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
              {form.role === "admin" ? "Admins can use every module and manage users." : "Sub admins can use every module but cannot manage users."}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
