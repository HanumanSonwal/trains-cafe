// Sends the two order WhatsApp messages (vendor + customer) for a placed order.
// Both go out at the same moment, in parallel. Safe to call more than once for
// the same order: an atomic claim on the order makes sure it is sent only once.
import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";
import Menu from "@/app/models/menu";
import "@/app/models/station";
import "@/app/models/vendor";
import { TEMPLATES, sendTemplate, toWaPhone, whatsappEnabled } from "@/app/lib/whatsapp";
import { customerVariables, vendorVariables } from "@/app/lib/orderMessage";

// Override with ZOEPACT_VENDOR_PHONE in the environment if the number ever changes.
const VENDOR_NUMBER = process.env.ZOEPACT_VENDOR_PHONE || "7665615638";

async function loadItems(orderId) {
  const rows = await OrderItems.find({ Order_Id: orderId }).lean();
  // one line per menu item, even if the rows were written more than once
  const byItem = new Map();
  for (const r of rows) if (!byItem.has(String(r.Item_Id))) byItem.set(String(r.Item_Id), r);
  const ids = [...byItem.keys()];
  const menu = ids.length ? await Menu.find({ _id: { $in: ids } }).select("Item_Name").lean() : [];
  const names = new Map(menu.map((m) => [String(m._id), m.Item_Name]));
  return [...byItem.values()].map((r) => ({
    name: names.get(String(r.Item_Id)) || "Item",
    quantity: r.Quantity,
  }));
}

/** Never throws: a WhatsApp problem must not break placing or paying an order. */
export async function notifyOrderPlaced(orderId) {
  try {
    if (!whatsappEnabled()) return { skipped: "disabled" };
    await dbConnect();

    const order = await Order.findOneAndUpdate(
      { _id: orderId, "whatsapp.claimedAt": null },
      { $set: { "whatsapp.claimedAt": new Date() } },
      { new: true }
    )
      .populate("station", "name code")
      .populate("vendor", "Vendor_Name");
    if (!order) return { skipped: "already-sent-or-missing" };

    const data = {
      order,
      items: await loadItems(order._id),
      stationName: order.station?.name,
    };
    const customerPhone = toWaPhone(order.user_details?.mobile);
    // Every vendor message goes to one fixed Trainscafe number, not to the vendor's own phone.
    const vendorPhone = toWaPhone(VENDOR_NUMBER);

    const [customer, vendor] = await Promise.all([
      sendTemplate({ phone: customerPhone, template: TEMPLATES.customer, variables: customerVariables(data) }),
      sendTemplate({ phone: vendorPhone, template: TEMPLATES.vendor, variables: vendorVariables(data) }),
    ]);

    const $set = { "whatsapp.customer": customer, "whatsapp.vendor": vendor };
    // Nothing went out: free the claim so a later call (e.g. a retry) can try again.
    if (!customer.ok && !vendor.ok) $set["whatsapp.claimedAt"] = null;
    await Order.updateOne({ _id: order._id }, { $set });

    if (!customer.ok || !vendor.ok) {
      console.error(
        `WhatsApp for order ${order.order_id}: customer=${customer.ok ? "ok" : customer.error}, vendor=${vendor.ok ? "ok" : vendor.error}`
      );
    }
    return { customer, vendor };
  } catch (err) {
    console.error("WhatsApp notify failed:", err?.message || err);
    return { error: true };
  }
}
