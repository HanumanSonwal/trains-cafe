// models/sales.js
import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  station: { type: mongoose.Schema.Types.ObjectId, ref: "Station" },
  total: Number,
  subTotal: Number,
  couponAmount: Number,
  user_details: Object,
  payment: Object,
  status: String,
}, { timestamps: true });

// ✅ Prevent model overwrite on hot reload
export default mongoose.models.Sales || mongoose.model("Sales", salesSchema);
