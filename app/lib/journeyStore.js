"use client";

// Remembers the traveller's details on this device so checkout can fill them in:
//  - the PNR lookup from the home page (train, coach, seat) for 12 hours,
//  - name and mobile from the last order, for the next order.
// Stored only in this browser (localStorage). Every access is guarded: private
// mode or blocked storage simply means nothing is prefilled.

const JOURNEY_KEY = "tc_journey";
const CONTACT_KEY = "tc_contact";
const JOURNEY_TTL = 12 * 60 * 60_000;

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/** Save what a PNR lookup returned (only the fields checkout needs). */
export function saveJourney(pnr, details = {}) {
  if (!/^\d{10}$/.test(String(pnr))) return;
  write(JOURNEY_KEY, {
    pnr: String(pnr),
    trainNo: String(details.trainNo || ""),
    trainName: details.trainName || "",
    coach: String(details.coach || ""),
    seatNo: String(details.seatNo || ""),
    passengerCount: Number(details.passengerCount) || 0,
    savedAt: Date.now(),
  });
}

export function loadJourney() {
  const j = read(JOURNEY_KEY);
  if (!j || !j.pnr || Date.now() - (j.savedAt || 0) > JOURNEY_TTL) return null;
  return j;
}

export function saveContact({ name, mobile } = {}) {
  if (!/^\d{10}$/.test(String(mobile || ""))) return;
  write(CONTACT_KEY, { name: String(name || "").slice(0, 60), mobile: String(mobile) });
}

export const loadContact = () => read(CONTACT_KEY);
