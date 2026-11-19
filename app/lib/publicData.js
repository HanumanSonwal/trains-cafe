// Read-only data for the public website: a station's kitchens, a kitchen's menu
// and the live coupon offers. Every query is lean (plain objects), selects only
// the fields the website shows (no phone numbers, commission or addresses) and
// is cached in memory for a short time.

import mongoose from "mongoose";
import dbConnect from "@/app/lib/dbConnect";
import { memo } from "@/app/lib/memoCache";
import VendorModel from "@/app/models/vendor";
import StationModel from "@/app/models/station";
import Menu from "@/app/models/menu";
import Category from "@/app/models/category";
import Coupon from "@/app/models/coupon";

const TTL = 60_000;

// What a customer may see about a kitchen.
const VENDOR_FIELDS =
  "vendorId Vendor_Name image Delivery_Charges Min_Order_Value Min_Order_Time Working_Time Weekly_Off Food_Type Status Station rating";

const toVendor = (v, station, stats) => ({
  _id: String(v._id),
  vendorId: v.vendorId,
  Vendor_Name: v.Vendor_Name,
  name: v.Vendor_Name,
  image: v.image || "",
  Delivery_Charges: Number(v.Delivery_Charges) || 0,
  Min_Order_Value: Number(v.Min_Order_Value) || 0,
  Min_Order_Time: Number(v.Min_Order_Time) || 0,
  Working_Time: v.Working_Time || "",
  Weekly_Off: v.Weekly_Off || "",
  Food_Type: Array.isArray(v.Food_Type) ? v.Food_Type : [],
  Status: v.Status,
  rating: Number(v.rating) || null,
  Station: String(station?._id || v.Station || ""),
  Station_Name: station?.name || "",
  Station_Code: station?.code || "",
  itemCount: stats?.items || 0,
  minPrice: stats?.minPrice ?? null,
});

async function findStation(code) {
  const exact = await StationModel.findOne({ code }).select("name code").lean();
  if (exact) return exact;
  // older rows may be stored in a different case; `code` is validated alphanumeric, so the regex is safe
  return StationModel.findOne({ code: { $regex: `^${code}$`, $options: "i" } })
    .select("name code")
    .lean();
}

/** Active kitchens at a station (by station code), with item count and lowest price. */
export function getStationVendors(rawCode) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{1,8}$/.test(code)) return Promise.resolve(null);

  return memo(`vendors:${code}`, TTL, async () => {
    await dbConnect();
    const station = await findStation(code);
    if (!station) return null;

    const vendors = await VendorModel.find({ Station: station._id, Status: "Active" })
      .select(VENDOR_FIELDS)
      .sort({ createdAt: -1 })
      .lean();
    if (!vendors.length) return { station, vendors: [] };

    const stats = await Menu.aggregate([
      { $match: { Vendor: { $in: vendors.map((v) => v._id) }, status: { $ne: false } } },
      {
        $group: {
          _id: "$Vendor",
          items: { $sum: 1 },
          minPrice: { $min: { $ifNull: ["$Final_Price", "$Price"] } },
        },
      },
    ]);
    const byVendor = new Map(stats.map((s) => [String(s._id), s]));

    return {
      station: { _id: String(station._id), name: station.name, code: station.code },
      vendors: vendors.map((v) => toVendor(v, station, byVendor.get(String(v._id)))),
    };
  });
}

const toItem = (m, vendorName) => ({
  _id: String(m._id),
  name: m.Item_Name,
  price: m.Price,
  Final_Price: m.Final_Price,
  description: m.Description,
  vendor: vendorName,
  discount: m.Discount,
  foodType: m.Food_Type,
  image: m.image,
});

/**
 * One kitchen's menu in a single round trip: { vendor, veg: [...], nonVeg: [...] }.
 * Each list holds categories ({ _id, categoryName, categoryImage, items }) in a stable order.
 */
export function getVendorMenu(vendorId) {
  if (!mongoose.isValidObjectId(vendorId)) return Promise.resolve(null);

  return memo(`menu:${vendorId}`, TTL, async () => {
    await dbConnect();
    const [vendor, items] = await Promise.all([
      VendorModel.findById(vendorId).select(VENDOR_FIELDS).populate("Station", "name code").lean(),
      Menu.find({ Vendor: vendorId, status: { $ne: false } })
        .select("Item_Name Price Final_Price Discount Description Food_Type image Category_Id")
        .sort({ createdAt: 1 })
        .lean(),
    ]);
    if (!vendor) return null;

    const categoryIds = [...new Set(items.map((m) => String(m.Category_Id)))];
    const categories = await Category.find({ _id: { $in: categoryIds } })
      .select("title image categoryid")
      .lean();
    const order = new Map(
      categories
        .sort((a, b) => (a.categoryid ?? 1e9) - (b.categoryid ?? 1e9) || String(a.title).localeCompare(b.title))
        .map((c, i) => [String(c._id), i])
    );
    const catById = new Map(categories.map((c) => [String(c._id), c]));

    const station = vendor.Station;
    const info = toVendor(vendor, station, {
      items: items.length,
      minPrice: items.length ? Math.min(...items.map((m) => m.Final_Price ?? m.Price)) : null,
    });

    const group = (list) => {
      const map = new Map();
      for (const m of list) {
        const id = String(m.Category_Id);
        const cat = catById.get(id);
        if (!cat) continue; // item points at a deleted category
        if (!map.has(id)) {
          map.set(id, {
            _id: id,
            categoryId: id,
            categoryName: cat.title,
            categoryImage: cat.image,
            vendor: info.Vendor_Name,
            station: info.Station_Name,
            items: [],
          });
        }
        map.get(id).items.push(toItem(m, info.Vendor_Name));
      }
      return [...map.values()].sort((a, b) => order.get(a._id) - order.get(b._id));
    };

    return {
      vendor: info,
      veg: group(items.filter((m) => m.Food_Type === "Vegetarian")),
      nonVeg: group(items.filter((m) => m.Food_Type !== "Vegetarian")),
    };
  });
}

/** Published coupons that can be used right now (same date rule as /api/coupon/apply). */
export function getActiveOffers() {
  return memo("offers", TTL, async () => {
    await dbConnect();
    const now = new Date();
    const rows = await Coupon.find({ status: "published", startDate: { $lte: now }, endDate: { $gte: now } })
      .select("title description code minimumAmount discount endDate")
      .sort({ minimumAmount: 1 })
      .lean();
    return rows.map((c) => ({
      _id: String(c._id),
      title: c.title,
      description: c.description || "",
      code: c.code,
      minimumAmount: Number(c.minimumAmount) || 0,
      discount: { type: c.discount?.type, value: Number(c.discount?.value) || 0 },
      endDate: c.endDate,
    }));
  });
}
