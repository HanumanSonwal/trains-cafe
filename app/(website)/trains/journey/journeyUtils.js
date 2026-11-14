const IST = "Asia/Kolkata";

export const todayIST = () => new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);

/** "21:42" -> "09:42 pm" */
export function to12h(hm) {
  if (!/^\d{2}:\d{2}$/.test(hm || "")) return "";
  const [h, m] = hm.split(":").map(Number);
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
}

/** ISO timestamp -> "04:49 pm" in Indian time. */
export function clockIST(value) {
  const t = typeof value === "number" ? value : Date.parse(value);
  if (!t) return "";
  return new Date(t)
    .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: IST })
    .toLowerCase();
}

/** "2026-11-14" -> "Sat, 14 Nov" */
export function runDateLabel(isoDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate || "")) return "";
  return new Date(`${isoDate}T12:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: IST,
  });
}

/** "Sun" when a stop falls on a different calendar day than today, so overnight trips read clearly. */
export function dayTag(isoDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate || "") || isoDate === todayIST()) return "";
  return new Date(`${isoDate}T12:00:00+05:30`).toLocaleDateString("en-IN", { weekday: "short", timeZone: IST });
}

export const isLate = (minutes) => Number(minutes) > 4;

/** One line about the train and the colour that goes with it. */
export function statusInfo(data) {
  const delay = Number(data?.delay_minutes) || 0;
  const status = data?.status || "";
  if (status === "cancelled") return { tone: "bad", text: "Cancelled", live: false };
  if (status === "not-started") return { tone: "plain", text: "Not started yet", live: false };
  if (data?.is_live || status === "running") {
    return isLate(delay)
      ? { tone: "late", text: `Running ${delay} min late`, live: true }
      : { tone: "good", text: "Running on time", live: true };
  }
  return { tone: "plain", text: "Live position unavailable", live: false };
}

export const TONE_TEXT = {
  good: "text-green-600",
  late: "text-amber-700",
  bad: "text-red-600",
  plain: "text-gray-500",
};

export const kitchenLabel = (n) => `${n} ${n === 1 ? "kitchen" : "kitchens"}`;
