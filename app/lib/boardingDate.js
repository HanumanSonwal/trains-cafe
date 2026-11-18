// Date helpers for the boarding-date picker. Pure functions, safe on server and client.
// All dates are "YYYY-MM-DD" in Indian time, which is what RailRadar's `date` expects:
// the day the train departs its first station.

const IST_MS = 330 * 60_000;

export const todayIST = () => new Date(Date.now() + IST_MS).toISOString().slice(0, 10);

export const isIsoDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "") && !Number.isNaN(Date.parse(s));

export function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const fmt = (iso, opts) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", ...opts });

export const fmtShort = (iso) => fmt(iso, { day: "numeric", month: "short" }); // 18 Nov
export const fmtLong = (iso) => fmt(iso, { weekday: "short", day: "numeric", month: "short", year: "numeric" }); // Wed, 18 Nov 2026

// A long train can have started several days ago and still be running; tickets open ~60 days ahead.
export function dateBounds() {
  const t = todayIST();
  return { min: addDays(t, -4), max: addDays(t, 60) };
}

export function quickDates() {
  const t = todayIST();
  return [
    [-1, "Yesterday"],
    [0, "Today"],
    [1, "Tomorrow"],
  ].map(([n, label]) => {
    const iso = addDays(t, n);
    return { iso, label, short: fmtShort(iso) };
  });
}
