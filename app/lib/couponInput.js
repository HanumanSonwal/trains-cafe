// Shared by the coupon add / update routes: clean and check what the admin sent.
export function parseCouponInput(body = {}) {
  const code = String(body.code || "").trim().toUpperCase();
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim().slice(0, 120);
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const minimumAmount = Number(body.minimumAmount);
  const type = body.discount?.type;
  const value = Number(body.discount?.value);
  const status = body.status;

  if (!/^[A-Z0-9]{3,12}$/.test(code)) return { error: "Coupon code must be 3-12 letters or digits" };
  if (!title) return { error: "Coupon title is required" };
  if (isNaN(startDate) || isNaN(endDate)) return { error: "Valid start and end dates are required" };
  if (endDate < startDate) return { error: "End date must be after the start date" };
  if (!Number.isFinite(minimumAmount) || minimumAmount < 1) return { error: "Minimum amount must be at least 1" };
  if (!["percentage", "flat", "fix"].includes(type)) return { error: "Choose a discount type" };
  if (!Number.isFinite(value) || value <= 0) return { error: "Discount value must be more than 0" };
  if (type === "percentage" && value > 100) return { error: "A percentage discount cannot be more than 100" };
  if (type !== "percentage" && value > minimumAmount) {
    return { error: "A flat discount cannot be more than the minimum order amount" };
  }
  if (!["published", "draft"].includes(status)) return { error: "Choose a status" };

  return {
    data: { code, title, description, startDate, endDate, minimumAmount, discount: { type, value }, status },
  };
}
