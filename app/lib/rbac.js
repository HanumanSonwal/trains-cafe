// Role based access for the admin panels. Pure functions, no Node-only imports,
// so the edge middleware, the API routes and the browser can all use them.
//
// Roles
//   admin      full access, and the only one that can manage users
//   sub-admin  full access to every module (kept for existing accounts)
//   staff      only the modules the admin ticked, each as "view" or "full"
//   user       website customer, no panel access
//
// A permission is { name: <module key>, level: "view" | "full" }.
//   view = can open the page and read
//   full = can also create, edit and delete

export const MODULES = [
  { key: "dashboard", label: "Dashboard", segment: "dashboard", group: "Overview", icon: "dashboard" },
  { key: "orders", label: "Orders", segment: "orders", group: "Operations", icon: "orders" },
  { key: "leads", label: "Leads", segment: "leads-managment", group: "Operations", icon: "leads" },
  { key: "contact-inquiries", label: "Contact Inquiries", segment: "contact-inquiries", group: "Operations", icon: "inquiries" },
  { key: "vendors", label: "Vendors", segment: "vendors", group: "Catalogue", icon: "vendors", extra: ["vendors-managment"] },
  { key: "vendor-requests", label: "Vendor Requests", segment: "vendor-requests", group: "Catalogue", icon: "requests" },
  { key: "stations", label: "Stations", segment: "stations-managment", group: "Catalogue", icon: "stations" },
  { key: "categories", label: "Categories", segment: "categories", group: "Catalogue", icon: "categories" },
  { key: "menu-items", label: "Menu Items", segment: "menu-items", group: "Catalogue", icon: "menu" },
  { key: "coupons", label: "Coupons", segment: "coupon-management", group: "Marketing", icon: "coupons" },
  { key: "website-pages", label: "Website Pages", segment: "website-pages", group: "Website", icon: "pages", extra: ["advertisements", "contact-info"] },
  { key: "station-pages", label: "Station Pages", segment: "station-pages", group: "Website", icon: "stationpages", extra: ["train-pages"] },
  { key: "blog", label: "Blog", segment: "blog", group: "Website", icon: "blog" },
  { key: "images", label: "Images", segment: "uploadimages", group: "Website", icon: "images" },
];

export const MODULE_KEYS = MODULES.map((m) => m.key);

const FULL_ROLES = new Set(["admin", "sub-admin"]);

export const isFullAccess = (user) => !!user && FULL_ROLES.has(user.role);
export const isAdmin = (user) => user?.role === "admin";
export const isPanelUser = (user) => isFullAccess(user) || user?.role === "staff";

/** Can this user use the module? level "view" (default) or "full" (write). */
export function can(user, moduleKey, level = "view") {
  if (!user) return false;
  if (isFullAccess(user)) return true;
  if (user.role !== "staff") return false;
  const perm = (user.permissions || []).find((p) => p.name === moduleKey);
  if (!perm) return false;
  return level === "view" ? true : perm.level === "full";
}

/** Modules a user may open, in menu order. */
export const allowedModules = (user) => MODULES.filter((m) => can(user, m.key, "view"));

const SEGMENT_TO_MODULE = new Map();
for (const m of MODULES) {
  SEGMENT_TO_MODULE.set(m.segment, m.key);
  for (const extra of m.extra || []) SEGMENT_TO_MODULE.set(extra, m.key);
}

/** "/admin/orders/x" or "/super-panel/orders" -> { panel, module } (module "users" = admin only). */
export function moduleForPage(pathname) {
  const m = /^\/(admin|super-panel)(?:\/([^/]+))?/.exec(pathname);
  if (!m) return null;
  const seg = m[2];
  if (!seg) return { panel: m[1], module: null }; // the panel root just redirects
  if (seg === "users" || seg === "manager" || seg === "managers") return { panel: m[1], module: "users" };
  return { panel: m[1], module: SEGMENT_TO_MODULE.get(seg) || null };
}

/** First page a user lands on after login. */
export function homePath(user, panel = "admin") {
  const first = allowedModules(user)[0];
  return first ? `/${panel}/${first.segment}` : null;
}

// ---- API guard rules -------------------------------------------------------
// Public endpoints are simply not listed. Each rule says which module the path
// belongs to and which HTTP methods need a signed-in user with access.
// methods: "all" | "write" (everything except GET/HEAD) | ["GET", ...]
const API_RULES = [
  { prefix: "/api/orders/place-order", skip: true },
  { prefix: "/api/orders/verify-payment", skip: true },
  { prefix: "/api/orders", module: "orders", methods: "all" },
  { prefix: "/api/dashboard", module: "dashboard", methods: "all" },
  { prefix: "/api/finance", module: "vendors", methods: "all" },
  { prefix: "/api/settlement", module: "vendors", methods: "all" },
  { prefix: "/api/leads", module: "leads", methods: ["GET"] }, // checkout creates / updates its own lead
  { prefix: "/api/contact", module: "contact-inquiries", methods: ["GET", "PUT", "PATCH", "DELETE"] },
  { prefix: "/api/vendorregistration", module: "vendor-requests", methods: ["GET", "PUT", "PATCH", "DELETE"] },
  { prefix: "/api/vendors", module: "vendors", methods: "write" },
  { prefix: "/api/station", module: "stations", methods: "write" },
  { prefix: "/api/categories", module: "categories", methods: "write" },
  { prefix: "/api/menu", module: "menu-items", methods: "write" },
  { prefix: "/api/coupon/apply", skip: true },
  { prefix: "/api/coupon", module: "coupons", methods: "write" },
  { prefix: "/api/blog", module: "blog", methods: "write" },
  { prefix: "/api/web-pages", module: "website-pages", methods: "write" },
  { prefix: "/api/advertisements", module: "website-pages", methods: "write" },
  { prefix: "/api/web-station", module: "station-pages", methods: "write" },
  { prefix: "/api/web-train", module: "station-pages", methods: "write" },
  { prefix: "/api/admin", module: "users", methods: "all" },
  { prefix: "/api/user", module: "users", methods: "all" },
  { prefix: "/api/Customer", module: "orders", methods: "all" },
];

const starts = (path, prefix) => path === prefix || path.startsWith(prefix + "/");

/** Which module (and what level) does this API request need? null = public. */
export function ruleForApi(pathname, method = "GET") {
  const rule = API_RULES.find((r) => starts(pathname, r.prefix));
  if (!rule || rule.skip) return null;
  const m = method.toUpperCase();
  const isRead = m === "GET" || m === "HEAD" || m === "OPTIONS";
  const applies =
    rule.methods === "all" || (rule.methods === "write" ? !isRead : rule.methods.includes(m));
  if (!applies) return null;
  return { module: rule.module, level: isRead ? "view" : "full" };
}

/** Does the user pass a rule from ruleForApi? ("users" needs the admin role.) */
export function passesRule(user, rule) {
  if (!rule) return true;
  if (rule.module === "users") return isAdmin(user);
  return can(user, rule.module, rule.level);
}
