// The message the team copies from Orders and pastes into WhatsApp for the vendor.

const money = (n) => `₹${(parseFloat(n) || 0).toFixed(2)}`;
const clean = (v, fallback = "N/A") => {
  const s = String(v ?? "").trim();
  return s && s.toLowerCase() !== "undefined" && s.toLowerCase() !== "null" ? s : fallback;
};

/**
 * "GUDUR JUNCTION" stays as is. A name without a type ("SURAT") still gets " JUNCTION"
 * like the old message did, but a name that already says JUNCTION / JN / TERMINUS /
 * CANTT / CITY / STATION never gets it twice.
 */
export function stationLine(name) {
  const n = clean(name, "").replace(/\s+/g, " ").toUpperCase();
  if (!n) return "N/A";
  return /\b(JUNCTION|JN|JCT|TERMINUS|CANTT|CANTONMENT|CITY|STATION)\b/.test(n) ? n : `${n} JUNCTION`;
}

export function deliveryLabel(value) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d)) return "N/A";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** `order` is one row of the Orders table (see orders/page.jsx). */
export function buildOrderText(order) {
  const advance = parseFloat(order.advancedAmount) || 0;
  const method = String(order.payment?.payment_method || order.paymentMethod || "").toUpperCase();

  const items =
    order.Items?.length > 0
      ? order.Items.map((i) => `• ${clean(i.MenuItem?.Item_Name, "Item")} × ${i.Quantity}`).join("\n")
      : "• No items";

  const lines = [
    `*Order ${clean(order.order_id)}*`,
    "",
    `👤 ${clean(order.userDetails?.name)}`,
    `📞 ${clean(order.userDetails?.mobile)}`,
    `🚆 Train ${clean(order.trainDetails?.train_number)} · PNR ${clean(order.trainDetails?.train_pnr, "NA")}`,
    `💺 Coach ${clean(order.userDetails?.coach)} · Seat ${clean(order.userDetails?.seatNo)}`,
    "",
    "*Items*",
    items,
    "",
  ];

  if (order.adminDiscountValue > 0) lines.push(`Discount: ${money(order.adminDiscountValue)}`);
  if (order.couponAmount > 0) lines.push(`Coupon: -${money(order.couponAmount)}`);
  lines.push(`*Total: ${money(order.total)}*`);
  if (advance > 0) {
    lines.push(`Advance paid: ${money(advance)} (${method || "ONLINE"})`);
    lines.push(`To collect: ${money(order.remainingAmount)} (${String(order.paymentMethod || "COD").toUpperCase()})`);
  } else {
    lines.push(`Payment: FULL PAID (${method || "ONLINE"})`);
  }

  lines.push(
    "",
    `⏰ Delivery: ${deliveryLabel(order.deliveryDateTime)}`,
    `📍 ${stationLine(order.station)}`,
    "",
    "Note: Please be on your seat at the delivery time.",
    "",
    "Thank you for contacting Trainscafe, enjoy your meal.",
    "For any query call 8696963496"
  );
  return lines.join("\n");
}
