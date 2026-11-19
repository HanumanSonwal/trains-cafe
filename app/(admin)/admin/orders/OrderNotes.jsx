"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, message } from "antd";
import dayjs from "dayjs";

const REASONS = [
  "Customer cancelled",
  "Vendor could not deliver",
  "Train late / missed the station",
  "Wrong or unreachable number",
  "Payment problem",
  "Duplicate order",
];

const KIND = {
  note: { dot: "bg-sky-500", label: "Note" },
  cancel: { dot: "bg-rose-500", label: "Cancelled" },
  status: { dot: "bg-amber-500", label: "Status" },
};

/** Asks why an order is being cancelled before the status is changed. */
export function CancelReasonModal({ open, order, onCancel, onConfirm, loading }) {
  const [preset, setPreset] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setPreset(null);
      setText("");
    }
  }, [open]);

  const reason = [preset, text.trim()].filter(Boolean).join(" - ");

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={`Cancel order #${order?.order_id || ""}`}
      okText="Cancel order"
      okButtonProps={{ danger: true, disabled: reason.length < 3 }}
      cancelText="Keep order"
      confirmLoading={loading}
      onOk={() => onConfirm(reason)}
      destroyOnClose
    >
      <p className="mb-3 text-sm text-gray-600">Say why this order is being cancelled. Only your team sees it.</p>
      <Select
        className="mb-3 w-full"
        placeholder="Pick a reason"
        allowClear
        value={preset}
        onChange={setPreset}
        options={REASONS.map((r) => ({ value: r, label: r }))}
      />
      <Input.TextArea rows={3} maxLength={400} showCount value={text} onChange={(e) => setText(e.target.value)} placeholder="Add details (optional if you picked a reason)" />
    </Modal>
  );
}

/** Timeline of the notes on an order, plus a box to add one. */
export function OrderNotesModal({ open, order, onClose, onChanged }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) {
      setNotes(order?.notes || []);
      setText("");
    }
  }, [open, order]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [notes.length, open]);

  const add = async () => {
    const value = text.trim();
    if (!value) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/notes/${order.orderID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const json = await res.json();
      if (!json.success) return message.error(json.message || "Could not save the note");
      setNotes(json.notes);
      setText("");
      onChanged?.();
    } catch {
      message.error("Could not save the note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={`Notes · order #${order?.order_id || ""}`} destroyOnClose>
      {order?.status === "cancel" && order?.cancelReason && (
        <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          <b>Cancelled:</b> {order.cancelReason}
        </div>
      )}

      <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
        {notes.length === 0 && <p className="py-6 text-center text-sm text-gray-400">No notes yet.</p>}
        {notes.map((n) => (
          <div key={n._id} className="flex gap-3">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${(KIND[n.kind] || KIND.note).dot}`} />
            <div className="min-w-0 flex-1">
              <p className="m-0 whitespace-pre-wrap break-words text-sm text-gray-800">{n.text}</p>
              <p className="m-0 mt-0.5 text-[11px] text-gray-400">
                {n.by || "Team"} · {dayjs(n.at).format("D MMM, h:mm A")}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <Input.TextArea rows={2} maxLength={500} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note for the team…" onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); add(); } }} />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Enter to save · Shift+Enter for a new line</span>
          <Button type="primary" onClick={add} loading={saving} disabled={!text.trim()}>
            Add note
          </Button>
        </div>
      </div>
    </Modal>
  );
}
