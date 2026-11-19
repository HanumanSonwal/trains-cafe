// Adds the three launch offers to the coupons collection.
//
//   node --env-file=.env scripts/seed-offers.mjs
//
// Safe to run more than once: a coupon that already exists (matched by code) is left
// exactly as it is, so edits made later in Coupon Management are never overwritten.
// Uses the MONGO_URI from your .env, so it writes to whichever database that points to.

import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is not set. Run with: node --env-file=.env scripts/seed-offers.mjs");
  process.exit(1);
}

const start = new Date();
start.setHours(0, 0, 0, 0);
const end = new Date("2027-12-31T23:59:59+05:30");

const OFFERS = [
  {
    code: "FLAT150",
    title: "₹150 OFF on Train Food Orders",
    description: "",
    minimumAmount: 1000,
    discount: { type: "flat", value: 150 },
  },
  {
    code: "BULK15",
    title: "15% OFF on Bulk Orders",
    description: "Perfect for group & family travel",
    minimumAmount: 2500,
    discount: { type: "percentage", value: 15 },
  },
  {
    code: "HAPPY75",
    title: "₹75 OFF on Train Meals",
    description: "Limited time railway offer",
    minimumAmount: 500,
    discount: { type: "flat", value: 75 },
  },
];

await mongoose.connect(uri);
const coupons = mongoose.connection.collection("coupons");

for (const offer of OFFERS) {
  const res = await coupons.updateOne(
    { code: offer.code },
    { $setOnInsert: { ...offer, startDate: start, endDate: end, status: "published" } },
    { upsert: true }
  );
  console.log(`${offer.code}: ${res.upsertedCount ? "added" : "already there (left unchanged)"}`);
}

await mongoose.disconnect();
