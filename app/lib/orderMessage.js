// Pure helpers that turn an order into the variables of the two WhatsApp templates.
// No database or network access here, so they are easy to test.
//
// Zoepact template "sendordertocustomer" (17 variables) and
// "sendordertovendor" (18 variables). The numbers are the {{n}} positions in the
// approved template body - do not reorder them without editing the template.

const TZ = "Asia/Kolkata";
const dateFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export const fmtDate = (d) => dateFmt.format(new Date(d)); // 14/11/2026
export const fmtTime = (d) => timeFmt.format(new Date(d)); // 22:00

const money = (n) => Number(n || 0).toFixed(2);

// WhatsApp rejects empty parameters, line breaks, tabs and runs of 4+ spaces.
export function param(value, max = 900) {
  const s = String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim()
    .slice(0, max);
  return s || "-";
}

/**
 * When should the food reach the passenger? The website checkout does not send a
 * delivery time, but the cart's station carries the train's ETA there ("HH:mm", IST).
 * An explicit deliveryDateTime (admin orders) always wins.
 */
export function resolveDeliveryDateTime(explicit, station) {
  if (explicit) {
    const d = new Date(explicit);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const eta = /^\d{1,2}:\d{2}$/.test(station?.eta || "") ? station.eta.padStart(5, "0") : "";
  if (eta) {
    const given = /^\d{4}-\d{2}-\d{2}$/.test(station?.eta_date || "") ? station.eta_date : "";
    const today = new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
    let d = new Date(`${given || today}T${eta}:00+05:30`);
    // No date given and the time is already well past: it is tomorrow's arrival.
    if (!given && d.getTime() < Date.now() - 60 * 60_000) d = new Date(d.getTime() + 86_400_000);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export function paymentInfo(order) {
  const total = Number(order.total) || 0;
  const method = order.payment?.payment_method;
  if (method === "RAZORPAY") {
    const paid = order.payment?.payment_status === "paid";
    return paid
      ? { label: "ONLINE PAID", advance: total, pending: 0 }
      : { label: "ONLINE PAYMENT PENDING", advance: 0, pending: total };
  }
  const advance = Math.min(Number(order.payment?.advanced) || 0, total);
  return {
    label: advance > 0 ? "PARTIAL ADVANCE PAID" : "CASH ON DELIVERY",
    advance,
    pending: Math.max(0, total - advance),
  };
}

export const itemsText = (items) =>
  items.length ? items.map((i) => `${i.name} x ${i.quantity}`).join(", ") : "-";

function context({ order, items, stationName }) {
  const u = order.user_details || {};
  const pay = paymentInfo(order);
  const when = order.deliveryDateTime || order.createdAt || new Date();
  return {
    orderId: param(order.order_id),
    name: param(u.name),
    mobile: param(u.mobile),
    altMobile: param(u.alternateMobile),
    train: param(order.train?.train_number),
    coach: param(u.coach),
    seat: param(u.seatNo),
    items: param(itemsText(items)),
    total: money(order.total),
    payLabel: pay.label,
    advance: money(pay.advance),
    pending: money(pay.pending),
    deliveryDate: fmtDate(when),
    deliveryTime: fmtTime(when),
    station: param(stationName),
    note: param(u.instructions, 300),
    pnr: param(u.pnr || order.train?.train_pnr),
    orderDate: fmtDate(order.createdAt || new Date()),
  };
}

// {{1}}..{{17}} of "sendordertocustomer"
export function customerVariables(data) {
  const c = context(data);
  return [
    c.name, c.orderId, c.mobile, c.train, c.coach, c.seat, c.items, c.total, c.payLabel,
    c.advance, c.pending, c.deliveryDate, c.deliveryTime, c.station, c.note, c.pnr, c.orderDate,
  ];
}

// {{1}}..{{18}} of "sendordertovendor"
export function vendorVariables(data) {
  const c = context(data);
  return [
    c.orderId, c.name, c.mobile, c.train, c.coach, c.seat, c.items, c.total, c.payLabel,
    c.advance, c.pending, c.deliveryDate, c.deliveryTime, c.station, c.note, c.pnr, c.altMobile, c.orderDate,
  ];
}
