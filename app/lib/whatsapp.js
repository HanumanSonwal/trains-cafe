// Server-only Zoepact WhatsApp client (https://dash.zoepact.com/api/v1).
// Auth: X-API-Key header. Only approved templates are sent, so messages are
// delivered whether or not the customer has chatted with us in the last 24h.
import { parsePhoneNumber } from "libphonenumber-js";

const BASE_URL = (process.env.ZOEPACT_BASE_URL || "https://dash.zoepact.com/api/v1").replace(/\/+$/, "");
const TIMEOUT_MS = 6000;

export const TEMPLATES = {
  customer: process.env.ZOEPACT_TEMPLATE_CUSTOMER || "sendordertocustomer",
  vendor: process.env.ZOEPACT_TEMPLATE_VENDOR || "sendordertovendor",
};
const LANGUAGE = process.env.ZOEPACT_TEMPLATE_LANG || "en";

// Orders keep working with the key missing; messages are simply not sent.
export const whatsappEnabled = () => Boolean(process.env.ZOEPACT_API_KEY);

// Set WHATSAPP_DRY_RUN=true to build everything but send nothing.
const dryRun = () => process.env.WHATSAPP_DRY_RUN === "true";

/** First valid Indian-default number among the candidates, as "919876543210" (no +). */
export function toWaPhone(...candidates) {
  for (const c of candidates) {
    if (!c) continue;
    try {
      const p = parsePhoneNumber(String(c).trim(), "IN");
      if (p?.isValid()) return p.number.replace("+", "");
    } catch {
      /* try the next one */
    }
  }
  return "";
}

/**
 * Send one approved template. Never throws: returns { ok, messageId?, error? }.
 * A timeout is not retried (the message may already be on its way, and a retry
 * would send it twice); a refused connection or a 5xx is retried once.
 */
export async function sendTemplate({ phone, template, variables }) {
  if (!phone) return { ok: false, error: "No valid WhatsApp number" };
  if (dryRun()) return { ok: true, messageId: "dry-run" };

  for (let attempt = 0; attempt < 2; attempt++) {
    let res;
    try {
      res = await fetch(`${BASE_URL}/messages/template`, {
        method: "POST",
        headers: { "X-API-Key": process.env.ZOEPACT_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ phone, template_name: template, language: LANGUAGE, variables }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
    } catch (err) {
      if (err?.name === "TimeoutError") return { ok: false, error: "Zoepact timed out" };
      if (attempt === 0) continue;
      return { ok: false, error: "Could not reach Zoepact" };
    }

    const json = await res.json().catch(() => null);
    if (res.ok && json?.success !== false) {
      const d = json?.data || {};
      return { ok: true, messageId: String(d.message_id || d.id || json?.message_id || "") };
    }
    if (res.status >= 500 && attempt === 0) continue;
    return { ok: false, error: String(json?.message || `Zoepact error ${res.status}`).slice(0, 300) };
  }
  return { ok: false, error: "Zoepact request failed" };
}
