import { MODULE_KEYS } from "@/app/lib/rbac";

/** Keep only known modules with a valid level, one entry per module. */
export function cleanPermissions(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Map();
  for (const p of input) {
    if (!p || !MODULE_KEYS.includes(p.name)) continue;
    seen.set(p.name, p.level === "full" ? "full" : "view");
  }
  return [...seen].map(([name, level]) => ({ name, level }));
}
